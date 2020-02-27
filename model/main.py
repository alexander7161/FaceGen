# Modified from https://github.com/pfnet-research/chainer-stylegan

import os
import sys
import tqdm
import numpy as np
import chainer
from chainer import Variable
from PIL import Image
from net import StyleGenerator, MappingNetwork
from google.cloud import storage, firestore
import tempfile
import base64
import json
import time

storage_client = storage.Client()
firestore_client = firestore.Client()

bucket = storage_client.bucket("facegen-fc9de.appspot.com")

files = ["SmoothedGenerator_405000.npz", "SmoothedMapping_405000.npz"]


def get_temp_file(file_name):
    return os.path.join(tempfile.gettempdir(), file_name)


def get_flags(flags):
    flags = {"stage": 17,
             "ch": 512, "n_avg_w": 20000, "trc_psi": 0.7, "enable_blur": False}

    if flags and 'seed' in flags:
        flags["seed"] = float(s)

    return flags


def download_model():
    for file in files:
        blob = bucket.blob(file)
        blob.download_to_filename(get_temp_file(file))
    print("model downloaded")


def convert_batch_images(x, rows, cols):
    x = np.asarray(np.clip(x * 127.5 + 127.5, 0.0, 255.0), dtype=np.uint8)
    _, _, H, W = x.shape
    x = x.reshape((rows, cols, 3, H, W))
    x = x.transpose(0, 3, 1, 4, 2)
    x = x.reshape((rows * H, cols * W, 3))
    return x


def generate_image(flags):
    mapping = MappingNetwork(flags["ch"])
    gen = StyleGenerator(flags["ch"], flags["enable_blur"])
    chainer.serializers.load_npz(get_temp_file(files[1]), mapping)
    chainer.serializers.load_npz(get_temp_file(files[0]), gen)
    for file in files:
        os.remove(get_temp_file(file))
    xp = gen.xp

    if "seed" in flags:
        np.random.seed(flags["seed"])
        xp.random.seed(flags["seed"])

    enable_trunction_trick = flags["trc_psi"] != 1.0

    if enable_trunction_trick:
        print("Calculate average W...")
        w_batch_size = 100
        n_batches = flags["n_avg_w"] // w_batch_size
        w_avg = xp.zeros(flags["ch"]).astype('f')
        with chainer.using_config('train', False), chainer.using_config('enable_backprop', False):
            for i in tqdm.tqdm(range(n_batches)):
                z = Variable(xp.asarray(mapping.make_hidden(w_batch_size)))
                w_cur = mapping(z)
                w_avg = w_avg + xp.average(w_cur.data, axis=0)
        w_avg = w_avg / n_batches

    if "seed" in flags:
        np.random.seed(flags["seed"])
        xp.random.seed(flags["seed"])

    print("Generating...")
    with chainer.using_config('train', False), chainer.using_config('enable_backprop', False):
        z = mapping.make_hidden(1)
        w = mapping(z).data
        if enable_trunction_trick:
            delta = w - w_avg
            w = delta * flags["trc_psi"] + w_avg

        x = gen(w, flags["stage"])
        x = chainer.cuda.to_cpu(x.data)
        x = convert_batch_images(x, 1, 1)
        return x


def upload_to_storage(image, ref, storageRef):
    temp_file_location = get_temp_file("temp.jpg")
    image.save(temp_file_location)
    blob = bucket.blob(storageRef)
    blob.upload_from_filename(temp_file_location)


def update_firestore(ref, storageRef, error=False):
    face_doc = {"complete": True,
                "timeCompleted": firestore.SERVER_TIMESTAMP, "storageRef": storageRef}
    if error:
        face_doc["error"] = True
        face_doc["complete"] = False
        face_doc["timeCompleted"] = None
        face_doc["storageRef"] = None
    firestore_client.document(ref).set(face_doc, merge=True)


def subscribe(event, context):
    firestore_face_ref = base64.b64decode(event['data']).decode('utf-8')
    storage_face_ref = firestore_face_ref + ".jpg"
    print(firestore_face_ref)

    print(event['attributes'])
    flags = get_flags(event['attributes'])
    print("Generating with flags" + json.dumps(flags))
    try:
        download_model()
        x = generate_image(flags)

        upload_to_storage(Image.fromarray(
            x), firestore_face_ref, storage_face_ref)
        update_firestore(firestore_face_ref, storage_face_ref)
    except:
        update_firestore(firestore_face_ref, storage_face_ref, True)

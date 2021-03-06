import os
import sys
import tqdm
import numpy as np
import chainer
from chainer import Variable
from PIL import Image
from net import StyleGenerator, MappingNetwork
from google.cloud import storage, firestore, pubsub_v1
import tempfile
import base64
import json
import time

storage_client = storage.Client()
firestore_client = firestore.Client()
publisher = pubsub_v1.PublisherClient()

# Google Cloud Storage Bucket
bucket = storage_client.bucket("facegen-fc9de.appspot.com")

# pre-trained model weights names.
files = ["SmoothedGenerator_405000.npz", "SmoothedMapping_405000.npz"]

"""
Get file in temp directory.
"""
def get_temp_file(file_name):
    return os.path.join(tempfile.gettempdir(), file_name)

"""
Merge input flags with default flags.
"""
def get_flags(flagsInput):
    flags = {"stage": 17,
             "ch": 512, "n_avg_w": 20000, "trc_psi": 0.7, "enable_blur": False}
    if flagsInput:         
        flags.update(flagsInput)

    if 'seed' in flags:
        flags["seed"] = float(flags["seed"])

    return flags


"""
Downloads model from Google Cloud Storage.
"""
def download_model_weights():
    for file in files:
        blob = bucket.blob(file)
        blob.download_to_filename(get_temp_file(file))


"""
Creates image from Generator output.
Adapted from https://github.com/pfnet-research/chainer-stylegan
"""
def convert_batch_images(x, rows, cols):
    x = np.asarray(np.clip(x * 127.5 + 127.5, 0.0, 255.0), dtype=np.uint8)
    _, _, H, W = x.shape
    x = x.reshape((rows, cols, 3, H, W))
    x = x.transpose(0, 3, 1, 4, 2)
    x = x.reshape((rows * H, cols * W, 3))
    return x

"""
Generate the face.
Adapted from https://github.com/pfnet-research/chainer-stylegan
Loads model weights from files.
Generates face using chainer-stylegan.
"""
def generate_image(flags):
    mapping = MappingNetwork(flags["ch"])
    gen = StyleGenerator(flags["ch"], flags["enable_blur"])
    # Load model weights
    chainer.serializers.load_npz(get_temp_file(files[1]), mapping)
    chainer.serializers.load_npz(get_temp_file(files[0]), gen)
    # Delete temporary files.
    for file in files:
        os.remove(get_temp_file(file))
    xp = gen.xp

    # Use a seed if set.
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

"""
Save image to a temporary file.
Upload this file to Google Cloud Storage.
"""
def upload_to_storage(image, ref, storageRef):
    temp_file_location = get_temp_file("temp.jpg")
    image.save(temp_file_location)
    blob = bucket.blob(storageRef)
    blob.upload_from_filename(temp_file_location)

"""
Update Face in Firestore database.
Set storageref and timecompleted if no error.
Set error if there is any error.
"""
def update_firestore(ref, storageRef, error=False):
    face_doc = {"complete": True,
                "timeCompleted": firestore.SERVER_TIMESTAMP,
                "storageRef": storageRef,
                "labelsLoading": True}
    if error:
        face_doc["error"] = True
        face_doc["complete"] = False
        face_doc["timeCompleted"] = None
        face_doc["storageRef"] = None
    firestore_client.document(ref).set(face_doc, merge=True)

"""
Publish message to label this face ref.
"""
def publish_label_request(ref):
    topic_path = publisher.topic_path("facegen-fc9de", "label-face")
    publisher.publish(topic_path, data=ref.encode("utf-8"))


"""
Main function that is run by Google Cloud Functions.
Takes the face ref from the event.
Generates a face using StyleGAN.
Saves this face to Cloud Storage and updates Cloud Firestore.
"""
def subscribe(event, context):
    # Firestore database face ref.
    firestore_face_ref = base64.b64decode(event['data']).decode('utf-8')
    # Storage file ref.
    storage_face_ref = firestore_face_ref + ".jpg"

    # Get flags for generating face merged with inputs.
    flags = get_flags(event['attributes'])

    try:
        # Pre trained weights required 
        download_model_weights()
        # Generate the image.
        x = generate_image(flags)
        # Upload image to Google Cloud Storage.
        upload_to_storage(Image.fromarray(
            x), firestore_face_ref, storage_face_ref)
        # Update the database with file ref and completed=true.
        update_firestore(firestore_face_ref, storage_face_ref)
        # Create Pub/Sub message to label this face.
        publish_label_request(firestore_face_ref)
    except:
        # Print any errors and update the database with error=true.
        print("Unexpected error:", sys.exc_info()[0])
        update_firestore(firestore_face_ref, storage_face_ref, True)

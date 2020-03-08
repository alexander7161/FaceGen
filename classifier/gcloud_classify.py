import os
import sys
import numpy as np
from PIL import Image
from google.cloud import storage, firestore
import tempfile
import base64
import json
import time


def classify(event, context):
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

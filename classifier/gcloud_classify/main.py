import numpy as np
from PIL import Image
from google.cloud import storage, firestore
import tempfile
import base64
import tensorflow as tf
from skimage import transform

storage_client = storage.Client()
firestore_client = firestore.Client()

bucket = storage_client.bucket("facegen-fc9de.appspot.com")


def download_model():
    blobs = bucket.list_blobs(prefix="model/")  # Get list of files
    for blob in blobs:
        filename = blob.name.replace('/', '_')
        blob.download_to_filename("model/" + filename)  # Download
    print("model downloaded")


def download_face_from_firestore(ref):
    blob = bucket.blob(ref)
    blob.download_to_filename("face.jpg")
    print("face downloaded")


def update_firestore(ref, labels):
    firestore_client.document(ref).set({labels}, merge=True)


def classify(event, context):
    columns = ["gender", "senior", "adult", "child"]
    firestore_face_ref = base64.b64decode(event['data']).decode('utf-8')
    storage_face_ref = firestore_face_ref + ".jpg"
    download_face_from_firestore(storage_face_ref)
    model = tf.keras.models.load_model('model')
    np_image = Image.open("face.jpg")
    np_image = np.array(np_image).astype('float32')/255
    np_image = transform.resize(np_image, (150, 150, 3))
    np_image = np.expand_dims(np_image, axis=0)
    pred = model.predict(np_image)
    pred_bool = (pred > 0.5)
    result = []
    i = 0
    ages = ["senior", "adult", "child"]
    while i < len(pred_bool[0]):
        prediction = pred_bool[0][i]
        if columns[i] == "gender":
            if prediction:
                result.append("female")
            else:
                result.append("male")
            i += 1
        elif columns[i] in ages:
            age_bools = pred_bool[0][1:5]
            most_likely_age_i = np.argmax(age_bools)
            result.append(ages[most_likely_age_i])
            i += 4
        elif prediction:
            result.append(columns[i])
            i += 1

    print(result)
    update_firestore(firestore_face_ref, result)

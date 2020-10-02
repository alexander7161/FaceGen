import tf = require("@tensorflow/tfjs-node");
import { Message } from "firebase-functions/lib/providers/pubsub";
import admin = require("firebase-admin");
import fs = require("fs");
import os = require("os");
import path = require("path");
import util = require("util");

/**
 * Classifies image from Google Pub/Sub topic label-face.
 */

const readFile = util.promisify(fs.readFile);

const tmpdir = os.tmpdir();
const facePath = path.join(tmpdir, "face.jpg");

admin.initializeApp();

const storageBucket = admin.storage().bucket("facegen-fc9de.appspot.com");

/**
 * Load classifier model.
 */
const loadModel = () =>
  tf.loadLayersModel(`file://${__dirname}/model/model.json`);

/**
 * Download face image from google Cloud Storage.
 * @param faceRef
 */
const getFaceImage = async (faceRef: string) => {
  const pathReference = storageBucket.file(faceRef + ".jpg");
  await pathReference.download({ destination: facePath });
};
/**
 * Saves labels to face in database.
 * @param ref face ref in firestore
 * @param labels string array of labels.
 */
const saveLabelsToFirestore = async (ref: string, labels: string[]) => {
  const faceRef = admin.firestore().doc(ref);
  await faceRef.set({ labels, labelsLoading: false }, { merge: true });
};

/**
 * Saves error to face in database.
 * @param ref face ref in firestore
 * @param error
 */
const saveError = async (ref: string, error: Error) => {
  const faceRef = admin.firestore().doc(ref);
  await faceRef.set(
    { labelError: error.message, labelsLoading: false },
    { merge: true }
  );
};

/**
 * Function to classify a generated face using CNN.
 * @param message from google Pub/Sub label-face topic.
 */
const classify = async (message: Message) => {
  const firestoreFaceRef = Buffer.from(message.data, "base64").toString();
  console.log(firestoreFaceRef);
  try {
    // Download model and download face image concurrently.
    const [model] = await Promise.all([
      loadModel(),
      getFaceImage(firestoreFaceRef),
    ]);
    // Load image from file.
    const image = await readFile(facePath);
    // Load image to tensor and adapt to model input.
    const imgTensor = tf.node
      .decodeImage(image)
      .resizeNearestNeighbor([150, 150])
      .expandDims()
      .toFloat();

    const result = model.predict(imgTensor);

    // Convert to float.
    const predictions = await (result as tf.Tensor<tf.Rank>)
      .asType("float32")
      .data();
    // Prediction classes
    const classes = ["gender", "senior", "adult", "child"];
    // First bit is gender.
    const gender = predictions[0] === 1 ? "female" : "male";
    // Take largest of remaining bits as age.
    const ageIndex = await tf
      .argMax(predictions.slice(1, predictions.length))
      .data();
    const age = classes[ageIndex[0] + 1];
    const labels = [gender, age];
    await saveLabelsToFirestore(firestoreFaceRef, labels);
  } catch (e) {
    console.error(e);
    await saveError(firestoreFaceRef, e);
  }
};

export default classify;

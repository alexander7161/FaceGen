import * as tf from "@tensorflow/tfjs-node";
import { Message } from "firebase-functions/lib/providers/pubsub";
import admin = require("firebase-admin");
import fs = require("fs");
import os = require("os");
import path = require("path");
import util = require("util");

const readFile = util.promisify(fs.readFile);

const tmpdir = os.tmpdir();
const facePath = path.join(tmpdir, "face.jpg");

admin.initializeApp();

const storageBucket = admin.storage().bucket("facegen-fc9de.appspot.com");

const loadModel = () =>
  tf.loadLayersModel("https://facegen-fc9de.web.app/tfjs/model.json");

const getFaceImage = async (faceRef: string) => {
  const pathReference = storageBucket.file(faceRef + ".jpg");
  await pathReference.download({ destination: facePath });
};

const saveLabelsToFirestore = async (ref: string, labels: string[]) => {
  const faceRef = admin.firestore().doc(ref);
  await faceRef.set({ labels, labelsLoading: false }, { merge: true });
};

/**
 * Function to classify a generated face using CNN.
 * @param message from google Pub/Sub label-face topic.
 */
const classify = async (message: Message) => {
  const firestoreFaceRef = Buffer.from(message.data, "base64").toString();
  const [model] = await Promise.all([
    loadModel(),
    getFaceImage(firestoreFaceRef),
  ]);

  const image = await readFile(facePath);

  const imgTensor = tf.node
    .decodeImage(image)
    .resizeNearestNeighbor([150, 150])
    .expandDims()
    .toFloat();

  const result = model.predict(imgTensor);
  const predictions = await (result as tf.Tensor<tf.Rank>)
    .asType("float32")
    .data();
  const classes = ["gender", "senior", "adult", "child"];

  const gender = predictions[0] === 1 ? "female" : "male";
  const ageIndex = await tf
    .argMax(predictions.slice(1, predictions.length))
    .data();
  const age = classes[ageIndex[0] + 1];
  const labels = [gender, age];
  await saveLabelsToFirestore(firestoreFaceRef, labels);
};

export default classify;

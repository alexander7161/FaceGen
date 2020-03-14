import * as tf from "@tensorflow/tfjs";

let model;

export async function loadModel() {
  model = await tf.loadLayersModel("tfjs/model.json");
}

export async function classify(image) {
  if (!model) {
    await loadModel();
  }
  let tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([150, 150])
    .toFloat()
    .expandDims();
  const result = model.predict(tensor);
  const predictions = await result.asType("float32").data();
  let classes = ["gender", "senior", "adult", "child"];

  const gender = predictions[0] === 1 ? "female" : "male";
  const ageIndex = await tf
    .argMax(predictions.slice(1, predictions.length))
    .data();
  const age = classes[ageIndex[0] + 1];
  const labels = [gender, age];
  return labels;
}

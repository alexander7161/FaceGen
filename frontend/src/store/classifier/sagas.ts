import {
  takeLatest,
  put,
  select,
  take,
  fork,
  cancel,
  call,
} from "redux-saga/effects";
import * as tf from "@tensorflow/tfjs";
import {
  loadModelSuccess,
  loadModel,
  loadModelFailure,
  predictionSuccess,
  predictionFailure,
  startWebcamPrediction,
  stopWebcamPrediction,
} from ".";
import { classifierModelSelector, modelLoadedSelector } from "./selector";
import { eventChannel } from "redux-saga";

/**
 * Load model from web server saga.
 */
function* loadModelSaga() {
  try {
    const model = yield tf.loadLayersModel("tfjs/model.json");
    yield put(loadModelSuccess(model));
  } catch (error) {
    yield put(loadModelFailure(error));
  }
}

/**
 * Function for a 1 second eventChannel timer.
 * Will emit every 1 second.
 */
function timer() {
  return eventChannel((emitter) => {
    const iv = setInterval(() => {
      emitter("");
    }, 1000);
    return () => {
      clearInterval(iv);
    };
  });
}

/**
 * Task for predicting the current webcam image class once per second.
 */
function* predictionTaskSaga() {
  // Get webcam image from DOM.
  let image = document.getElementById("webcam") as HTMLVideoElement;
  // Get the classifier model from state.
  const modelLoaded: boolean = yield select(modelLoadedSelector);
  let model: tf.LayersModel | null = yield select(classifierModelSelector);
  if (!modelLoaded) {
    // If model is not loaded, load it and wait for success.
    yield put(loadModel());
    const { payload } = yield take(loadModelSuccess);
    // Use the most recently loaded model.
    model = payload;
  }
  const chan = yield call(timer);

  try {
    while (true) {
      // Wait for timer to emit. Will emit every 1 second.
      yield take(chan);
      // Take the image from the webcam. Resize to 150x150. Adapt to fit model expected input.
      let tensor = tf.browser
        .fromPixels(image)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims();
      // Run prediction
      const result = model!.predict(tensor);
      // Get predictions array.
      const predictions:
        | Float32Array
        | Int32Array
        | Uint8Array = yield (result as tf.Tensor<tf.Rank>)
        .asType("float32")
        .data();
      console.log(predictions);

      let classes = ["gender", "senior", "adult", "child"];
      // Gender based on first bit.
      const gender = predictions[0] === 1 ? "female" : "male";
      // Get argmax of the remaining bits.
      const agePredictions = predictions.slice(1);
      const ageIndex: tf.backend_util.TypedArray = yield tf
        .argMax(agePredictions)
        .data();
      // Get Ageindex result and add one to get the age label.
      const age = classes[ageIndex[0] + 1];
      const labels = [gender, age];
      yield put(predictionSuccess(labels));
    }
  } finally {
  }
}

/**
 * Wait for startWebcamPrediction action.
 * Run predictionTaskSaga in background.
 * When stopWebcamPrediction is dispatched cancel the background task.
 *
 */
function* predictImageSaga() {
  try {
    while (yield take(startWebcamPrediction)) {
      const predictionTask = yield fork(predictionTaskSaga);
      yield take(stopWebcamPrediction);
      yield cancel(predictionTask);
    }
  } catch (e) {
    yield put(predictionFailure(e));
  }
}

export default function* root() {
  // Run loadModelSaga on loadModel Action
  yield takeLatest(loadModel, loadModelSaga);
  // Run the predictImageSaga in the background.
  yield fork(predictImageSaga);
}

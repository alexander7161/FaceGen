import {
  takeLatest,
  put,
  select,
  take,
  fork,
  cancel,
  call
} from "redux-saga/effects";
import * as tf from "@tensorflow/tfjs";
import {
  loadModelSuccess,
  loadModel,
  loadModelFailure,
  predictionSuccess,
  predictionFailure,
  startWebcamPrediction,
  stopWebcamPrediction
} from ".";
import { classifierModelSelector, modelLoadedSelector } from "./selector";
import { eventChannel } from "redux-saga";

function* loadModelSaga() {
  try {
    const model = yield tf.loadLayersModel("tfjs/model.json");
    yield put(loadModelSuccess(model));
  } catch (error) {
    yield put(loadModelFailure(error));
  }
}

function timer() {
  return eventChannel(emitter => {
    const iv = setInterval(() => {
      emitter("");
    }, 1000);
    return () => {
      clearInterval(iv);
    };
  });
}

function* predictionTaskSaga() {
  let image = document.getElementById("webcam") as HTMLVideoElement;
  const modelLoaded: boolean = yield select(modelLoadedSelector);
  let model: tf.LayersModel | null = yield select(classifierModelSelector);
  if (!modelLoaded) {
    yield put(loadModel());
    const { payload } = yield take(loadModelSuccess);
    model = payload;
  }
  const chan = yield call(timer);

  try {
    while (true) {
      yield take(chan);
      let tensor = tf.browser
        .fromPixels(image)
        .resizeNearestNeighbor([150, 150])
        .toFloat()
        .expandDims();
      const result = model!.predict(tensor);
      const predictions:
        | Float32Array
        | Int32Array
        | Uint8Array = yield (result as tf.Tensor<tf.Rank>)
        .asType("float32")
        .data();
      let classes = ["gender", "senior", "adult", "child"];

      const gender = predictions[0] === 1 ? "female" : "male";
      const ageIndex: tf.backend_util.TypedArray = yield tf
        .argMax(predictions.slice(1, predictions.length))
        .data();
      const age = classes[ageIndex[0] + 1];
      const labels = [gender, age];
      yield put(predictionSuccess(labels));
    }
  } finally {
  }
}

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
  yield takeLatest(loadModel, loadModelSaga);
  yield fork(predictImageSaga);
}

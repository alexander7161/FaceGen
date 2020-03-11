import { takeLatest, put, takeEvery, select, take } from "redux-saga/effects";
import * as tf from "@tensorflow/tfjs";
import {
  loadModelSuccess,
  predictImage,
  loadModel,
  loadModelFailure,
  predictionSuccess,
  predictionFailure
} from ".";
import { classifierModelSelector, modelLoadedSelector } from "./selector";

function* loadModelSaga() {
  try {
    const model = yield tf.loadLayersModel("tfjs/model.json");
    yield put(loadModelSuccess(model));
  } catch (error) {
    yield put(loadModelFailure(error));
  }
}

function* predictImageSaga({
  payload: image
}: ReturnType<typeof predictImage>) {
  try {
    const modelLoaded: boolean = yield select(modelLoadedSelector);
    let model: tf.LayersModel | null = yield select(classifierModelSelector);
    if (!modelLoaded) {
      yield put(loadModel());
      const { payload } = yield take(loadModelSuccess);
      model = payload;
    }
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
  } catch (e) {
    yield put(predictionFailure(e));
  }
}

export default function* root() {
  yield takeLatest(loadModel, loadModelSaga);
  yield takeEvery(predictImage, predictImageSaga);
}

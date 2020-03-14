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
const worker = require("workerize-loader!./classifier.worker"); // eslint-disable-line import/no-webpack-loader-syntax

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

const getImage = () => {
  let v = document.getElementById("webcam") as HTMLVideoElement;
  var canvas = document.getElementById("c") as HTMLCanvasElement;
  var context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  var cw = canvas.width;
  var ch = canvas.height;
  var vw = v.videoWidth;
  var vh = v.videoHeight;
  if (cw / ch < vw / vh) {
    var th = (cw * vh) / vw;
    context.drawImage(v, 0, 0, vw, vh, 0, (ch - th) / 2, cw, th);
  } else {
    var tw = (ch * vw) / vh;
    context.drawImage(v, 0, 0, vw, vh, (cw - tw) / 2, 0, tw, ch);
  }
  return context.getImageData(0, 0, v.videoWidth, v.videoHeight);
};

function* predictionTaskSaga() {
  const chan = yield call(timer);
  let instance = worker();

  try {
    while (true) {
      yield take(chan);
      const image = getImage();
      const labels = yield instance.classify(image);
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

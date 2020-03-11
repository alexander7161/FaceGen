import { fork } from "redux-saga/effects";
import UserSagas from "./user/sagas";
import FacesSagas from "./faces/sagas";
import GeneratorSagas from "./generator/sagas";
import ClassifierSagas from "./classifier/sagas";

export default function*() {
  yield fork(UserSagas);
  yield fork(FacesSagas);
  yield fork(GeneratorSagas);
  yield fork(ClassifierSagas);
}

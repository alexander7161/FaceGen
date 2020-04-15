import { fork } from "redux-saga/effects";
import UserSagas from "./user/sagas/index";
import FacesSagas from "./faces/sagas/index";
import GeneratorSagas from "./generator/sagas";
import ClassifierSagas from "./classifier/sagas";

// start all sagas in background.
export default function* () {
  yield fork(UserSagas);
  yield fork(FacesSagas);
  yield fork(GeneratorSagas);
  yield fork(ClassifierSagas);
}

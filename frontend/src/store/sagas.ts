import { fork } from "redux-saga/effects";
import UserSagas from "./user/sagas";
import FacesSagas from "./faces/sagas";

export default function*() {
  yield fork(UserSagas);
  yield fork(FacesSagas);
}

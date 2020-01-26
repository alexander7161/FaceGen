import { fork } from "redux-saga/effects";
import FacesSyncSagas from "./sync";
import DeleteFacesSagas from "./delete";

export default function* root() {
  yield fork(FacesSyncSagas);
  yield fork(DeleteFacesSagas);
}

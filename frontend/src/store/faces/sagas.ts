import { put, fork, takeLatest } from "redux-saga/effects";
import { setUser } from "../user";
import { syncCollection } from "../utils/firestoreSync";
import { receiveFaces } from ".";

function* syncFacesSaga({ payload }: ReturnType<typeof setUser>) {
  if (payload) {
    yield fork(syncCollection(`users/${payload.uid}/faces`, receiveFaces));
  } else {
    yield put(receiveFaces(null));
  }
}

export default function* root() {
  yield takeLatest(setUser, syncFacesSaga);
}

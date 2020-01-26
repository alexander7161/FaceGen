import { put, fork, takeLatest } from "redux-saga/effects";
import firebase from "../../../fbConfig";
import { setUser } from "../../user";
import { syncCollection } from "../../utils/firestoreSync";
import { receiveFaces } from "..";

function* syncFacesSaga({ payload }: ReturnType<typeof setUser>) {
  if (payload) {
    const ref = firebase
      .firestore()
      .collection(`users/${payload.uid}/faces`)
      .orderBy("timeCreated");

    yield fork(syncCollection(ref, receiveFaces));
  } else {
    yield put(receiveFaces(null));
  }
}

export default function* root() {
  yield takeLatest(setUser, syncFacesSaga);
}

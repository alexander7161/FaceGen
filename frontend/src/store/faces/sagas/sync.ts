import { put, fork, takeLatest } from "redux-saga/effects";
import firebase from "../../../fbConfig";
import { setUser } from "../../user";
import { syncCollection } from "../../utils/firestoreSync";
import { receiveFaces } from "..";
import { firestore } from "firebase";

type FirebaseGeneratedFaceData = GeneratedFaceData & {
  timeCreated: number | firestore.Timestamp;
  timeCompleted: number | firestore.Timestamp | undefined;
};

const isTimestamp = (
  x: number | firestore.Timestamp | undefined
): x is firestore.Timestamp => {
  return !!(x && (x as firestore.Timestamp).nanoseconds !== undefined);
};

function* syncFacesSaga({ payload }: ReturnType<typeof setUser>) {
  if (payload) {
    const ref = firebase
      .firestore()
      .collection(`users/${payload.uid}/faces`)
      .orderBy("timeCreated");

    yield fork(
      syncCollection(
        ref,
        receiveFaces,
        undefined,
        (f: FirebaseGeneratedFaceData) => ({
          ...f,
          timeCreated: isTimestamp(f.timeCreated)
            ? +f.timeCreated.toDate()
            : f.timeCreated,
          timeCompleted: isTimestamp(f.timeCompleted)
            ? +f.timeCompleted.toDate()
            : f.timeCompleted
        })
      )
    );
  } else {
    yield put(receiveFaces(null));
  }
}

export default function* root() {
  yield takeLatest(setUser, syncFacesSaga);
}

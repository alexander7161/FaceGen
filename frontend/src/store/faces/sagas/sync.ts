import { put, fork, takeLatest } from "redux-saga/effects";
import firebase from "../../../fbConfig";
import { setUser } from "../../user";
import { syncCollection } from "../../utils/firestoreSync";
import { receiveFaces } from "..";
import type { firestore } from "firebase";

type FirebaseGeneratedFaceData = GeneratedFaceData & {
  timeCreated: number | firestore.Timestamp;
  timeCompleted: number | firestore.Timestamp | undefined;
};

/**
 * Some timestamps were saved as numbers and some as firestore.timestamps.
 * This allows the sync function to handle both.
 */
const isTimestamp = (
  x: number | firestore.Timestamp | undefined
): x is firestore.Timestamp => {
  return !!(x && (x as firestore.Timestamp).nanoseconds !== undefined);
};

/**
 * Saga to sync faces belonging to a user when a user signs in.
 */
function* syncFacesSaga({ payload: user }: ReturnType<typeof setUser>) {
  if (user) {
    const ref = firebase
      .firestore()
      .collection(`users/${user.uid}/faces`)
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
            : f.timeCompleted,
        })
      )
    );
  } else {
    // No user
    yield put(receiveFaces(null));
  }
}

export default function* root() {
  yield takeLatest(setUser, syncFacesSaga);
}

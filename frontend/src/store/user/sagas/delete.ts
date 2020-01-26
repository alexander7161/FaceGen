import { deleteAllFacesSaga } from "../../faces/sagas/delete";
import firebase from "firebase";
import { select, call, takeEvery, put } from "redux-saga/effects";
import { userIdSelector } from "../selectors";
import rsf from "../../rsf";
import { deleteUser, signOut, signInWithGoogle } from "..";
import { facesSelector } from "../../faces/selectors";

function* deleteUserSaga() {
  const faces: GeneratedFaceData[] | null = yield select(facesSelector);
  if (faces) {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - 5);
    const notCompleteAndNotOld = faces.filter(f => !f.complete);
    if (notCompleteAndNotOld.length > 0) {
      console.error("wait for jobs to finish");
      return;
    }
  }
  try {
    const userId: string | undefined = yield select(userIdSelector);
    yield deleteAllFacesSaga();
    const userRef = firebase.firestore().doc(`users/${userId}`);
    yield userRef.delete();
    try {
      yield call(rsf.auth.deleteProfile);
    } catch (e) {
      if (e.code && e.code === "auth/requires-recent-login") {
        yield put(signInWithGoogle());
      }
    }
    yield put(signOut());
    yield alert("Account deleted Succesfully");
  } catch (e) {
    console.error(e);
  }
}

export default function* root() {
  yield takeEvery(deleteUser, deleteUserSaga);
}

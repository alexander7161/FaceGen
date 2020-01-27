import { put, call, debounce, takeEvery } from "redux-saga/effects";
import {
  generateFace,
  generateFaceSuccess,
  generateFaceFailure,
  goToGeneratePage
} from ".";
import firebase from "../../fbConfig";
import rsf from "../rsf";
import { push } from "connected-react-router";

const createFaceObjectSaga = async (userId: string) => {
  const faceRef = await firebase
    .firestore()
    .collection(`users/${userId}/faces`)
    .add({ timeCreated: +new Date(), complete: false });
  return faceRef.id;
};

function* generateFaceSaga() {
  try {
    let user: firebase.User | null = firebase.auth().currentUser;
    if (!user) {
      try {
        user = yield call(rsf.auth.signInAnonymously);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(user);
    user = firebase.auth().currentUser;
    if (user) {
      const faceId = yield createFaceObjectSaga(user.uid);
      const idToken: string = yield user.getIdToken();
      const response: Response = yield fetch(
        "https://us-central1-facegen-fc9de.cloudfunctions.net/api/generateFace",
        {
          method: "POST",
          headers: { authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ faceId })
        }
      );
      const text: string = yield response.text();
      if (response.ok) {
        yield put(generateFaceSuccess());
      } else {
        yield put(generateFaceFailure(new Error(text)));
      }
    } else {
      yield put(generateFaceFailure(new Error("User not signed in.")));
    }
  } catch (e) {
    console.error(e);
    yield put(generateFaceFailure(e));
  }
}

function* goToGeneratePageSaga() {
  yield put(push("/generate"));
  yield put(generateFace());
}

export default function* root() {
  yield debounce(5000, generateFace, generateFaceSaga);
  yield takeEvery(goToGeneratePage, goToGeneratePageSaga);
}

import { put, takeEvery, select, call, debounce } from "redux-saga/effects";
import { generateFace, generateFaceSuccess, generateFaceFailure } from ".";
import { firestore } from "firebase";
import { userSelector } from "../user/selectors";
import rsf from "../rsf";

const createFaceObjectSaga = async (userId: string) => {
  const faceRef = await firestore()
    .collection(`users/${userId}/faces`)
    .add({ timeCreated: +new Date(), complete: false });
  return faceRef.id;
};

function* generateFaceSaga() {
  let user: firebase.User | null = yield select(userSelector);
  if (!user) {
    try {
      user = yield call(rsf.auth.signInAnonymously);
    } catch (error) {
      console.log(error);
    }
  }
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
    console.log(text);
    if (response.ok) {
      put(generateFaceSuccess);
    } else {
      put(generateFaceFailure(new Error(text)));
    }
  } else {
    put(generateFaceFailure(new Error("User not signed in.")));
  }
}

export default function* root() {
  yield debounce(5000, generateFace, generateFaceSaga);
}

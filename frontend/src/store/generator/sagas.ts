import { put, call, debounce } from "redux-saga/effects";
import { generateFace, generateFaceSuccess, generateFaceFailure } from ".";
import rsf from "../rsf";
import * as firebase from "firebase/app";

/**
 * Function to get a new face id for a given user.
 * @param userId
 */
const getNewFaceId = (userId: string) =>
  firebase.firestore().collection(`users/${userId}/faces`).doc().id;

/**
 * Saga to initiate face generation.
 *
 */
function* generateFaceSaga() {
  try {
    let user: firebase.User | null = firebase.auth().currentUser;
    if (!user) {
      // If user not signed in, sign in anonymously.
      try {
        user = yield call(rsf.auth.signInAnonymously);
      } catch (error) {
        console.log(error);
      }
    }
    user = firebase.auth().currentUser;
    if (user) {
      const faceId = yield getNewFaceId(user.uid);
      const idToken: string = yield user.getIdToken();
      // Generate Face.
      const response: Response = yield fetch(
        "https://us-central1-facegen-fc9de.cloudfunctions.net/api/generateFace",
        {
          method: "POST",
          headers: { authorization: `Bearer ${idToken}` },
          body: JSON.stringify({ faceId }),
        }
      );
      if (response.ok) {
        yield put(generateFaceSuccess());
      } else {
        const text: string = yield response.text();
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

export default function* root() {
  // Prevent generating more than one face per 5 seconds.
  yield debounce(5000, generateFace, generateFaceSaga);
}

import { takeEvery, call, put } from "redux-saga/effects";
import rsf from "../../rsf";
import { signInAnonymously, signInWithGoogle, setUser } from "..";
import * as firebase from "firebase/app";

/**
 * Saga to sign in anonymously.
 */
function* signInAnonymouslySaga() {
  try {
    yield call(rsf.auth.signInAnonymously);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Saga to sign in with google Oauth.
 */
function* signInWithGoogleSaga() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const user: firebase.User | null = firebase.auth().currentUser;
  if (user) {
    const result: firebase.auth.UserCredential = yield user.linkWithPopup(
      provider
    );
    yield put(setUser(result.user));
  } else {
    yield firebase.auth().signInWithPopup(provider);
  }
}

export default function* root() {
  yield takeEvery(signInAnonymously, signInAnonymouslySaga);
  yield takeEvery(signInWithGoogle, signInWithGoogleSaga);
}

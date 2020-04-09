import { takeEvery, call, put } from "redux-saga/effects";
import rsf from "../../rsf";
import { signIn, signInAnonymously, signInWithGoogle, setUser } from "..";
import { push } from "connected-react-router";
import firebase from "firebase";

function* signInSaga({
  payload: { email, password },
}: ReturnType<typeof signIn>) {
  try {
    yield call(rsf.auth.signInWithEmailAndPassword, email, password);
  } catch (error) {
    console.log(error);
  }
}

function* signInAnonymouslySaga() {
  try {
    yield call(rsf.auth.signInAnonymously);
  } catch (error) {
    console.log(error);
  }
}

function* signInWithGoogleSaga() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const user: firebase.User | null = firebase.auth().currentUser;
  if (user) {
    const result: firebase.auth.UserCredential = yield user.linkWithPopup(
      provider
    );
    yield put(setUser(result.user));
    yield put(push("/"));
    console.log(result);
  } else {
    const result: firebase.auth.UserCredential = yield firebase
      .auth()
      .signInWithPopup(provider);
    console.log(result);
  }
}

export default function* root() {
  yield takeEvery(signIn, signInSaga);
  yield takeEvery(signInAnonymously, signInAnonymouslySaga);
  yield takeEvery(signInWithGoogle, signInWithGoogleSaga);
}

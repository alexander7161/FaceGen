import { takeEvery, call, select, put } from "redux-saga/effects";
import rsf from "../../rsf";
import { signIn, signInAnonymously, signInWithGoogle, setUser } from "..";
import { auth } from "firebase";
import { userSelector } from "../selectors";
import { push } from "connected-react-router";

function* signInSaga({
  payload: { email, password }
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
  const provider = new auth.GoogleAuthProvider();
  const user: firebase.User | null = yield select(userSelector);
  if (user) {
    const result: auth.UserCredential = yield user.linkWithPopup(provider);
    yield put(setUser(result.user));
    yield put(push("/"));
    console.log(result);
  } else {
    const result: auth.UserCredential = yield auth().signInWithPopup(provider);
    console.log(result);
  }
}

export default function* root() {
  yield takeEvery(signIn, signInSaga);
  yield takeEvery(signInAnonymously, signInAnonymouslySaga);
  yield takeEvery(signInWithGoogle, signInWithGoogleSaga);
}

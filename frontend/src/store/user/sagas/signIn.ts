import { takeEvery, call } from "redux-saga/effects";
import rsf from "../../rsf";
import { signIn, signInAnonymously } from "..";

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

export default function* root() {
  yield takeEvery(signIn, signInSaga);
  yield takeEvery(signInAnonymously, signInAnonymouslySaga);
}

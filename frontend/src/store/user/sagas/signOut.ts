import { takeEvery, call } from "redux-saga/effects";
import rsf from "../../rsf";
import { signOut } from "..";

/**
 * Signout user saga.
 * Unsubscribes firestore listeners.
 */
function* signoutUserSaga() {
  try {
    yield call(rsf.auth.signOut);
  } catch (error) {
    console.error(error.message);
  }
}

export default function* root() {
  yield takeEvery(signOut, signoutUserSaga);
}

import { put, takeEvery, call } from "redux-saga/effects";
import { push } from "connected-react-router";
import rsf from "../../rsf";
import { signOut } from "..";

function* signoutUserSaga() {
  yield put(push(`/`));
  try {
    yield call(rsf.auth.signOut);
    console.log("signOut succesful");
  } catch (error) {
    console.log(error.message);
  }
}

export default function* root() {
  yield takeEvery(signOut, signoutUserSaga);
}

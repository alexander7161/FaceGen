import { put, call, fork, take, takeLatest } from "redux-saga/effects";
import rsf from "../../rsf";
import { setUser, setUserError, setUserData } from "..";
import { syncDocument } from "../../utils/firestoreSync";

function* syncUserSaga() {
  const channel = yield call(rsf.auth.channel);
  while (true) {
    const { error, user } = yield take(channel);

    const userJson = user?.toJSON();

    yield put(setUser(userJson));
    if (error) {
      yield put(setUserError(error));
    }
  }
}

function* syncUserDataSaga({ payload }: ReturnType<typeof setUser>) {
  if (payload) {
    yield fork(syncDocument(`users/${payload.uid}`, setUserData));
  } else {
    yield put(setUserData(null));
  }
}

export default function* root() {
  yield fork(syncUserSaga);
  yield takeLatest(setUser, syncUserDataSaga);
}

import { fork } from "redux-saga/effects";
import userSyncSagas from "./sync";
import userSignoutSagas from "./signOut";
import userSigninSagas from "./signIn";
import deleteUserSagas from "./delete";

export default function* root() {
  yield fork(userSyncSagas);
  yield fork(userSignoutSagas);
  yield fork(userSigninSagas);
  yield fork(deleteUserSagas);
}

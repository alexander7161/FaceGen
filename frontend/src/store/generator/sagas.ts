import { put, takeEvery, call, select } from "redux-saga/effects";
import { push } from "connected-react-router";
import { generateFace, generateFaceSuccess, generateFaceFailure } from ".";
import { functions } from "firebase";

function* generateFaceSaga() {
  const response: Response = yield fetch(
    "https://us-central1-facegen-fc9de.cloudfunctions.net/api/generateFace"
  );
  const text: string = yield response.text();
  if (response.ok) {
    put(generateFaceSuccess);
  } else {
    put(generateFaceFailure(new Error(text)));
  }
}

export default function* root() {
  yield takeEvery(generateFace, generateFaceSaga);
}

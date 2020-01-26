import { select, takeEvery } from "redux-saga/effects";
import firebase from "../../../fbConfig";
import { deleteFace, deleteAllFaces } from "..";
import { userIdSelector } from "../../user/selectors";
import { facesSelector } from "../selectors";

const deleteFaceFunction = async (userId: string, faceId: string) => {
  const faceRef = firebase.firestore().doc(`users/${userId}/faces/${faceId}`);
  const face = await faceRef.get();
  const faceData = face.data() as GeneratedFaceData | undefined;
  if (faceData) {
    if (faceData.storageRef) {
      const storageRef = firebase.storage().ref(faceData.storageRef);
      await storageRef.delete();
    }
    await faceRef.delete();
  } else {
    throw new Error("No face");
  }
};

function* deleteFaceSaga({ payload: faceId }: ReturnType<typeof deleteFace>) {
  try {
    const userId: string | undefined = yield select(userIdSelector);
    if (userId) {
      yield deleteFaceFunction(userId, faceId);
    } else {
      throw new Error("No account");
    }
  } catch (e) {
    console.error(e);
  }
}

export function* deleteAllFacesSaga() {
  try {
    const userId: string | undefined = yield select(userIdSelector);
    const faces: GeneratedFaceData[] | null = yield select(facesSelector);
    if (userId && faces) {
      const deleteFaces = faces.map(f => deleteFaceFunction(userId, f.id));
      yield Promise.all(deleteFaces);
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* root() {
  yield takeEvery(deleteFace, deleteFaceSaga);
  yield takeEvery(deleteAllFaces, deleteAllFacesSaga);
}

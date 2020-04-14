import { select, takeEvery } from "redux-saga/effects";
import firebase from "../../../fbConfig";
import { deleteFace, deleteAllFaces } from "..";
import { userIdSelector } from "../../user/selectors";
import { facesSelector } from "../selectors";

/**
 * Async function to delete a single face.
 * @param userId
 * @param faceId
 */
const deleteFaceFunction = async (userId: string, faceId: string) => {
  const faceRef = firebase.firestore().doc(`users/${userId}/faces/${faceId}`);
  const face = await faceRef.get();
  const faceData = face.data() as GeneratedFaceData | undefined;
  if (faceData) {
    if (faceData.storageRef) {
      // Delete face file in storage.
      const storageRef = firebase.storage().ref(faceData.storageRef);
      await storageRef.delete();
    }
    // Delete face firestore document.
    await faceRef.delete();
  } else {
    throw new Error("Face doesn't exist.");
  }
};

/**
 * Saga to delete a face.
 * Assumes face belongs to current user.
 */
function* deleteFaceSaga({ payload: faceId }: ReturnType<typeof deleteFace>) {
  try {
    const userId: string | undefined = yield select(userIdSelector);
    if (userId) {
      yield deleteFaceFunction(userId, faceId);
    } else {
      throw new Error("User not signed in.");
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Saga to delete all faces belonging to a user.
 */
export function* deleteAllFacesSaga() {
  try {
    const userId: string | undefined = yield select(userIdSelector);
    const faces: GeneratedFaceData[] | null = yield select(facesSelector);
    if (userId && faces) {
      const deleteFaces = faces.map((f) => deleteFaceFunction(userId, f.id));
      yield Promise.allSettled(deleteFaces);
    } else {
      throw new Error("No user or faces.");
    }
  } catch (e) {
    console.error(e);
  }
}

export default function* root() {
  yield takeEvery(deleteFace, deleteFaceSaga);
  yield takeEvery(deleteAllFaces, deleteAllFacesSaga);
}

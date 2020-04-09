import { Action } from "redux";
import rsf from "../rsf";
import { take, cancel, fork } from "redux-saga/effects";
import { signOut } from "../user";
import type { firestore } from "firebase";

/**
 * Get doc data and return object with data and id.
 * @param doc
 */
const getDoc = (doc: any) => ({ ...doc.data(), id: doc.id });

/**
 * Generic Saga to sync a firestore collection.
 * Uses https://redux-saga-firebase.js.org/reference/dev/firestore#syncCollection
 * @param ref to sync. Can be string path or Query object.
 * @param onSuccess Action for successful sync.
 * @param onFailure Action for a failed sync.
 * @param transform Optional function to transform resultant object.
 */
export const syncCollection = (
  ref: string | firestore.Query,
  onSuccess: (data: any) => Action<any>,
  onFailure?: (error: Error) => Action<any>,
  transform?: (payload: any & { id: string }) => any
) =>
  function* () {
    const task = yield fork(rsf.firestore.syncCollection, ref as any, {
      successActionCreator: onSuccess,
      failureActionCreator: onFailure,
      transform: (x: any) => {
        // Initialize payload as empty array.
        const payload: any[] = [];
        // For each document in collection:
        x.forEach((doc: any) => {
          // Include all doc data and set id as doc id.
          const finalDoc = getDoc(doc);
          if (transform) {
            payload.push(transform(finalDoc));
          } else {
            payload.push(finalDoc);
          }
        });
        return payload;
      },
    });
    // If user signs out stop syncing.
    yield take(signOut);
    yield cancel(task);
  };

/**
 * Generic Saga to sync a firestore document
 * Uses https://redux-saga-firebase.js.org/reference/dev/firestore#syncDocument
 * @param ref string of path or DocumentReference.
 * @param onSuccess Action for successful sync.
 * @param onFailure Action for a failed sync.
 * @param transform Optional function to transform resultant object.
 */
export const syncDocument = (
  ref: string | firestore.DocumentReference,
  onSuccess: (data: any) => Action<any>,
  onFailure?: (error: Error) => Action<any>,
  transform?: (payload: any & { id: string }) => any
) =>
  function* () {
    const task = yield fork(rsf.firestore.syncDocument, ref, {
      successActionCreator: onSuccess,
      failureActionCreator: onFailure,
      transform: (doc: any) =>
        doc.exists ? (transform ? transform(getDoc(doc)) : getDoc(doc)) : {},
    });
    // If user signs out stop syncing.
    yield take(signOut);
    yield cancel(task);
  };

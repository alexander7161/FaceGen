import { Action } from "redux";
import rsf from "../rsf";
import { take, cancel, fork } from "redux-saga/effects";
import { signOut } from "../user";
import { firestore } from "firebase";

export const syncCollection = (
  ref: string | firestore.Query,
  onSuccess: (data: unknown) => Action<any>,
  onFailure?: (error: Error) => Action<any>,
  transform?: (payload: any & { id: string }) => any
) =>
  function*() {
    const task = yield fork(rsf.firestore.syncCollection, ref as any, {
      successActionCreator: onSuccess,
      failureActionCreator: onFailure,
      transform: (x: any) => {
        const payload: any[] = [];
        x.forEach((doc: any) => {
          if (transform) {
            payload.push(
              transform({
                ...doc.data(),
                id: doc.id
              })
            );
          } else {
            payload.push({
              ...doc.data(),
              id: doc.id
            });
          }
        });
        return payload;
      }
    });
    yield take(signOut);
    yield cancel(task);
  };

export const syncDocument = (
  ref: string | firestore.DocumentReference,
  onSuccess: (data: unknown) => Action<any>,
  onFailure?: (error: Error) => Action<any>,
  transform?: (payload: any & { id: string }) => any
) =>
  function*() {
    const task = yield fork(rsf.firestore.syncDocument, ref, {
      successActionCreator: onSuccess,
      failureActionCreator: onFailure,
      transform: (doc: any) =>
        doc.exists
          ? transform
            ? transform({ ...doc.data(), id: doc.id })
            : {
                ...doc.data(),
                id: doc.id
              }
          : {}
    });
    yield take(signOut);
    yield cancel(task);
  };

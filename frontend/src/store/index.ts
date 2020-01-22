import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import AppSagas from "./sagas";

const history = createBrowserHistory();

const reducer = createRootReducer(history);

const saga = createSagaMiddleware();

const store = configureStore({
  reducer,
  middleware: [saga, routerMiddleware(history)]
});

saga.run(AppSagas);

export default store;

export { history };

export type AppState = ReturnType<typeof reducer>;

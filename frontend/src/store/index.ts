import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import createRootReducer from "./reducers";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware } from "connected-react-router";
import AppSagas from "./sagas";

const history = createBrowserHistory();
const reducer = createRootReducer(history);
const saga = createSagaMiddleware();
// Create store with reducer and middlewares for
// Redux-Saga and connected react router.
const store = configureStore({
  reducer,
  middleware: [saga, routerMiddleware(history)],
});
// Run saga middleware.
saga.run(AppSagas);

export default store;

export { history };
// Export overall types of reducer.
export type AppState = ReturnType<typeof reducer>;

import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { History } from "history";

export default (history: History) =>
  combineReducers({
    router: connectRouter(history)
  });

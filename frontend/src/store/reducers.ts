import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import UserReducer from "./user";
import FacesReducer from "./faces";

export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user: UserReducer,
    faces: FacesReducer
  });

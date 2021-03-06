import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import UserReducer from "./user";
import FacesReducer from "./faces";
import GeneratorReducer from "./generator";
import ClassifierReducer from "./classifier";

// Combine all reducers and export.
export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user: UserReducer,
    faces: FacesReducer,
    generator: GeneratorReducer,
    classifier: ClassifierReducer,
  });

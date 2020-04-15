import { combineReducers } from "@reduxjs/toolkit";
import { connectRouter } from "connected-react-router";
import { History } from "history";

import UserReducer from "./user/index";
import FacesReducer from "./faces/index";
import GeneratorReducer from "./generator/index";
import ClassifierReducer from "./classifier/index";

// Combine all reducers and export.
export default (history: History) =>
  combineReducers({
    router: connectRouter(history),
    user: UserReducer,
    faces: FacesReducer,
    generator: GeneratorReducer,
    classifier: ClassifierReducer,
  });

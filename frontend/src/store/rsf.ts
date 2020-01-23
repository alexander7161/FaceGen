import ReduxSagaFirebase from "redux-saga-firebase";
import firebase from "../fbConfig";
const rsf = new ReduxSagaFirebase(firebase as any);
export default rsf;

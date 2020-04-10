import ReduxSagaFirebase from "redux-saga-firebase";
import firebase from "../fbConfig";
// Export a Redux-Saga-Firebase instance
// with credentials from fbConfig.
// https://github.com/n6g7/redux-saga-firebase
const rsf = new ReduxSagaFirebase(firebase as any);
export default rsf;

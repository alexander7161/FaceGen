import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import config from "../../firebase-config.json";

const firebaseApp = firebase.initializeApp(config);

export default firebaseApp;

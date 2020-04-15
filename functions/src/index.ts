import * as functions from "firebase-functions";
import classify from "./classify";
import api from "./api";

// Expose Express API.
exports.api = functions.https.onRequest(api);

// Classify on pubsub topic publish.
exports.classify = functions.pubsub.topic("label-face").onPublish(classify);

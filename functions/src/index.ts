import * as functions from "firebase-functions";
import express = require("express");
import cors = require("cors");
import firebaseAuthMiddleware from "./auth.middleware";
import generateFace from "./generateFace";
import classify from "./classify";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post("/generateFace", firebaseAuthMiddleware, async (req, res) =>
  res.send(await generateFace(req, res))
);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

exports.classify = functions.pubsub.topic("label-face").onPublish(classify);

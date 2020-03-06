import * as functions from "firebase-functions";
import express = require("express");
import cors = require("cors");
import generateFace from "./generateFace";
import firebaseAuthMiddleware from "./auth.middleware";

const admin = require("firebase-admin");
admin.initializeApp();

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.post("/generateFace", firebaseAuthMiddleware, async (req, res) =>
  res.send(await generateFace(req, res))
);

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

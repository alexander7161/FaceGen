import * as functions from "firebase-functions";
import express = require("express");
import cors = require("cors");
import generateFace from "./generateFace";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get("/generateFace", async (req, res) => res.send(await generateFace()));

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);

import express = require("express");
import cors = require("cors");
import firebaseAuthMiddleware from "../middleware/auth.middleware";
import generateFace from "./generateFace";

const app = express();

// Only allow cross origin requests from frontend.
app.use(
  cors({
    origin: true,
  })
);

/**
 * Generate face function.
 * Uses Firebase Auth Middleware
 */
app.post("/generateFace", firebaseAuthMiddleware, async (req, res) =>
  res.send(await generateFace(req, res))
);

export default app;

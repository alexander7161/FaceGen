import express = require("express");
import cors = require("cors");
import firebaseAuthMiddleware from "../middleware/auth.middleware";
import generateFace from "./generateFace";

const app = express();

// Only allow cross origin requests from frontend.
app.use(
  cors({
    origin: ["https://facegen-fc9de.web.app/", "https://facegen-fc9de.web.app"],
    optionsSuccessStatus: 200,
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

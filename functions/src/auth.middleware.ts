import { Request, Response, NextFunction } from "express";
import admin = require("firebase-admin");

export default function firebaseAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorization = req.header("Authorization");
  if (authorization) {
    const token = authorization.split(" ");
    admin
      .auth()
      .verifyIdToken(token[1])
      .then(decodedToken => {
        res.locals.user = decodedToken;
        next();
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(401);
      });
  } else {
    res.sendStatus(401);
  }
}

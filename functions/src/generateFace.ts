const { PubSub } = require("@google-cloud/pubsub");
const pubsub = new PubSub();

import { Request, Response } from "express";

const generateFace = async (req: Request, res: Response) => {
  const body = JSON.parse(req.body);
  if (!body.faceId) {
    res
      .status(500)
      .send(
        'Missing parameter(s); include "faceId" properties in your request.'
      );
    return;
  }
  const userId = res.locals.user.uid;
  const faceId = body.faceId;

  const topic = pubsub.topic("generate-face");

  const messageBuffer = Buffer.from(`users/${userId}/faces/${faceId}`, "utf8");

  const flags = {
    // origin: "nodejs-sample",
    // username: "gcp"
  };

  await topic.publish(messageBuffer, flags);
  return "OK";
};

export default generateFace;

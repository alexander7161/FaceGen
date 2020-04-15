import { Request, Response } from "express";
import { firestore } from "firebase-admin";
const { PubSub } = require("@google-cloud/pubsub");

const pubsub = new PubSub();

/**
 * Generate Face API function.
 * Requires a FaceID.
 * Publishes message in generate-face topic.
 */
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
  const faceRef = `users/${userId}/faces/${faceId}`;

  const topic = pubsub.topic("generate-face");

  const messageBuffer = Buffer.from(faceRef, "utf8");

  // Flags to send to styleGAN generator.
  const flags = {
    // seed: 1
  };

  await topic.publish(messageBuffer, flags);
  await firestore().doc(faceRef).set({
    timeCreated: firestore.FieldValue.serverTimestamp(),
    complete: false,
  });
  return "OK";
};

export default generateFace;

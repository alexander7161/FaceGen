import React from "react";
import Webcam from "react-webcam";

const WebcamView = ({ onError }: { onError?: (error: string) => void }) => {
  return (
    <Webcam
      audio={false}
      width={"100%"}
      // Use user facing webcam and use a square resolution of 720x720
      videoConstraints={{ width: 720, height: 720, facingMode: "user" }}
      id="webcam"
      mirrored
      onUserMediaError={onError}
    />
  );
};

export default WebcamView;

import React from "react";
import Webcam from "react-webcam";

const WebcamView = () => {
  return (
    <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      width={"100%"}
      // Use user facing webcam and use a square resolution of 720x720
      videoConstraints={{ width: 720, height: 720, facingMode: "user" }}
      id="webcam"
      mirrored
    />
  );
};

export default WebcamView;

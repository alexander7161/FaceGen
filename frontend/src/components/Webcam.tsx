import React from "react";
import Webcam from "react-webcam";

const WebcamView = () => {
  return (
    <Webcam
      audio={false}
      screenshotFormat="image/jpeg"
      width={"100%"}
      videoConstraints={{ width: 720, height: 720, facingMode: "user" }}
      id="webcam"
    />
  );
};

export default WebcamView;

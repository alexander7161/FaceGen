import React from "react";
import Webcam from "react-webcam";

const WebcamView = () => {
  return (
    <>
      <Webcam
        audio={false}
        height={"100%"}
        screenshotFormat="image/jpeg"
        width={"100%"}
        videoConstraints={{ width: 1280, height: 720, facingMode: "user" }}
        id="webcam"
      />
      <canvas id="c" hidden></canvas>
    </>
  );
};

export default WebcamView;

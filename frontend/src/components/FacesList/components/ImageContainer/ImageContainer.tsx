import React from "react";
import { CircularProgress } from "@material-ui/core";
import ImageErrorComponent from "./ImageErrorComponent";

/**
 * Component to display the face image.
 * If error returns errorComponent
 * If the image is complete and there is a valid storageRef
 * returns the image
 * Else return loading indicator.
 */
const ImageContainer = ({
  f,
  imageURL,
}: {
  f: GeneratedFaceData;
  imageURL?: string;
}) => {
  if (f.error) {
    return <ImageErrorComponent />;
  } else if (f.complete && f.storageRef) {
    return (
      <img
        alt=""
        src={imageURL}
        style={{ height: "100%", width: "100%", display: "flex" }}
      />
    );
  } else {
    return <CircularProgress style={{ height: "100%", width: "100%" }} />;
  }
};

export default ImageContainer;

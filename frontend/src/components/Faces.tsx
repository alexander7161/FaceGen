import React from "react";
import { useSelector } from "react-redux";
import { facesSelector } from "../store/faces/selectors";

const Faces = () => {
  const faces = useSelector(facesSelector);
  if (faces === null) {
    return <>No Faces yet</>;
  }

  return <>{faces.map(f => "f")}</>;
};

export default Faces;

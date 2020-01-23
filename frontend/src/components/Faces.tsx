import React from "react";
import { useSelector } from "react-redux";
import { facesSelector } from "../store/faces/selectors";
import FirebaseImage from "./FirebaseImage";
import { CircularProgress } from "@material-ui/core";

const Face = ({ f }: { f: GeneratedFaceData }) => {
  return (
    <div key={f.id}>
      {f.id} {f.complete.toString()}
      {f.complete && f.storageRef ? (
        <FirebaseImage storageRef={f.storageRef} />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

const Faces = () => {
  const faces = useSelector(facesSelector);
  if (!faces) {
    return <div>No Faces yet</div>;
  }

  return (
    <>
      {faces.map(f => (
        <Face f={f} />
      ))}
    </>
  );
};

export default Faces;

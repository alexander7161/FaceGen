import React from "react";
import { useSelector } from "react-redux";
import { facesSelector } from "../store/faces/selectors";
import FirebaseImage from "./FirebaseImage";
import { CircularProgress } from "@material-ui/core";

const Face = ({ f }: { f: GeneratedFaceData }) => {
  return (
    <div>
      {f.id}
      {f.error ? (
        "error"
      ) : f.complete && f.storageRef ? (
        <FirebaseImage storageRef={f.storageRef} />
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

const FacesList = () => {
  const faces = useSelector(facesSelector);
  if (!faces) {
    return <div>No Faces yet</div>;
  }

  return (
    <>
      {faces.map(f => (
        <Face key={f.id} f={f} />
      ))}
    </>
  );
};

export default FacesList;

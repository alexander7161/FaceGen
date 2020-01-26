import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { facesSelector } from "../store/faces/selectors";
import FirebaseImage from "./FirebaseImage";
import { CircularProgress, Button, Paper } from "@material-ui/core";
import { deleteFace } from "../store/faces";
import styled from "styled-components";

const ImageContainer = ({
  f,
  error
}: {
  f: GeneratedFaceData;
  error: boolean;
}) => {
  if (error) {
    return <div>error </div>;
  }
  return f.complete && f.storageRef ? (
    <FirebaseImage storageRef={f.storageRef} />
  ) : (
    <CircularProgress />
  );
};

const ListItem = styled(Paper)`
  margin: 4px 0px;
  display: flex;
  flex-direction: row;
`;

const Face = ({ f }: { f: GeneratedFaceData }) => {
  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - 5);
  const error = f.error || (!f.complete && f.timeCreated < +dateNow);

  const dispatch = useDispatch();
  const deleteFaceFunction = () => {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - 5);
    if (f.complete) {
      dispatch(deleteFace(f.id));
    } else {
      alert("Please wait until face has finished processing.");
    }
  };

  return (
    <ListItem>
      <div style={{ height: 100, width: 100 }}>
        <ImageContainer f={f} error={error} />
      </div>
      <Button onClick={deleteFaceFunction} variant="contained" color="primary">
        Delete
      </Button>
    </ListItem>
  );
};

const FacesList = () => {
  const faces = useSelector(facesSelector);
  if (!faces || faces.length === 0) {
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

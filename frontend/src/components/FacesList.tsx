import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { facesSelector } from "../store/faces/selectors";
import {
  CircularProgress,
  GridListTile,
  GridListTileBar,
  IconButton,
  Grid,
  ButtonBase
} from "@material-ui/core";
import { deleteFace } from "../store/faces";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import GetAppIcon from "@material-ui/icons/GetApp";
import useFirebaseFile from "./useFirebaseFile";

const ImageContainer = ({
  f,
  error,
  imageURL
}: {
  f: GeneratedFaceData;
  error: boolean;
  imageURL?: string;
}) => {
  if (error) {
    return <div>error </div>;
  }
  return f.complete && f.storageRef ? (
    <img alt="" src={imageURL} style={{ height: "100%", width: "100%" }} />
  ) : (
    <CircularProgress style={{ height: "100%", width: "100%" }} />
  );
};

const FaceContainer = styled(GridListTile)`
  list-style-type: none;
`;

const Face = ({ f }: { f: GeneratedFaceData }) => {
  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - 5);
  const error = f.error || (!f.complete && f.timeCreated < +dateNow);

  const imageURL = useFirebaseFile(f.storageRef || "");
  console.log(imageURL);
  const dispatch = useDispatch();
  const deleteFaceFunction = () => {
    const dateNow = new Date();
    dateNow.setMinutes(dateNow.getMinutes() - 5);
    if (f.complete) {
      if (window.confirm("Are you sure you want to delete this image?")) {
        dispatch(deleteFace(f.id));
      }
    } else {
      alert("Please wait until face has finished processing.");
    }
  };

  return (
    <FaceContainer key={f.id}>
      <ImageContainer f={f} error={error} imageURL={imageURL} />
      <GridListTileBar
        title={new Date(f.timeCreated).toLocaleDateString(undefined, {
          hour: "2-digit",
          minute: "2-digit"
        })}
        subtitle={
          <ButtonBase
            style={{
              width: "100%",
              justifyContent: "flex-start",
              color: f.complete ? "white" : "gray"
            }}
            disabled={!f.complete}
            download
            href={imageURL || "#"}
            target="_blank"
          >
            <IconButton aria-label={`delete ${f.id}`}>
              <GetAppIcon
                style={{
                  height: 15,
                  width: 15,
                  color: f.complete ? "white" : "gray"
                }}
              />
            </IconButton>
            Download
          </ButtonBase>
        }
        actionIcon={
          <IconButton
            aria-label={`delete ${f.id}`}
            style={{ color: f.complete ? "white" : "gray" }}
            onClick={deleteFaceFunction}
            disabled={!f.complete}
          >
            <DeleteIcon />
          </IconButton>
        }
      />
    </FaceContainer>
  );
};

const FacesList = () => {
  const faces = useSelector(facesSelector);
  if (!faces || faces.length === 0) {
    return <div>No Faces yet</div>;
  }

  return (
    <Grid container spacing={3}>
      {faces.map(f => (
        <Grid item xs={4} key={f.id}>
          <Face f={f} />
        </Grid>
      ))}
    </Grid>
  );
};

export default FacesList;

import React from "react";
import { useSelector } from "react-redux";
import { facesSelector, facesLoadingSelector } from "../store/faces/selectors";
import {
  CircularProgress,
  Grid,
  Hidden,
  Modal,
  Typography
} from "@material-ui/core";
import styled from "styled-components";
import Face, { ImageContainer, LabelContainer, FaceMenu } from "./Face";
import useFirebaseFile from "./useFirebaseFile";

const CenteredCicularProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`;

const FaceModal = ({ f }: { f: GeneratedFaceData }) => {
  const imageURL = useFirebaseFile(f.storageRef || "");
  const dateNow = new Date();
  dateNow.setMinutes(dateNow.getMinutes() - 5);

  return (
    <div style={{ outline: 0, backgroundColor: "white" }}>
      <>
        <ImageContainer f={f} imageURL={imageURL} />

        <Typography variant="h6" style={{ padding: 8 }}>
          {new Date(f.timeCreated).toLocaleDateString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </Typography>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 4
          }}
        >
          <LabelContainer f={f} />
          <FaceMenu f={f} imageURL={imageURL} color="black" />
        </div>
      </>
    </div>
  );
};

const FacesList = () => {
  const faces = useSelector(facesSelector);
  const facesLoading = useSelector(facesLoadingSelector);
  const [faceIndex, setFaceIndex] = React.useState<number | undefined>(
    undefined
  );

  if (facesLoading) {
    return <CenteredCicularProgress />;
  }

  if (!faces || faces.length === 0) {
    return <div>No Faces yet</div>;
  }

  return (
    <>
      <Grid container spacing={3}>
        {faces.map((f, i) => (
          <Grid item xs={4} key={f.id}>
            <Face f={f} openFaceModal={() => setFaceIndex(i)} />
          </Grid>
        ))}
      </Grid>
      <Hidden smUp>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={faceIndex !== undefined}
          onClose={() => setFaceIndex(undefined)}
        >
          {faceIndex !== undefined ? <FaceModal f={faces[faceIndex]} /> : <></>}
        </Modal>
      </Hidden>
    </>
  );
};

export default FacesList;

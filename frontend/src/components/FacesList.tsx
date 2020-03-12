import React from "react";
import { useSelector } from "react-redux";
import { facesSelector, facesLoadingSelector } from "../store/faces/selectors";
import { CircularProgress, Grid } from "@material-ui/core";
import styled from "styled-components";
import Face from "./Face";

const CenteredCicularProgress = styled(CircularProgress)`
  display: block;
  margin: auto;
`;

const FacesList = () => {
  const faces = useSelector(facesSelector);
  const facesLoading = useSelector(facesLoadingSelector);
  if (facesLoading) {
    return <CenteredCicularProgress />;
  }

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

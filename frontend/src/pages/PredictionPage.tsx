import React from "react";
import { Container, CircularProgress, Button, Chip } from "@material-ui/core";
import styled from "styled-components";
import WebcamCapture from "../components/Webcam";
import { useSelector, useDispatch } from "react-redux";
import {
  predictionSelector,
  predictionErrorSelector,
  predictionLoadingSelector
} from "../store/classifier/selector";
import { predictImage } from "../store/classifier";
import PredictButton from "../components/PredictButton";
const StyledContainer = styled(Container)`
  margin-bottom: 64px;
`;

const Prediction = () => {
  const prediction = useSelector(predictionSelector);
  const predictionError = useSelector(predictionErrorSelector);

  if (predictionError) {
    return <>"error"</>;
  }

  return (
    <>
      {prediction?.map(p => (
        <Chip key={p} label={p} />
      ))}
    </>
  );
};

const PredictionPage = () => {
  return (
    <StyledContainer maxWidth="md">
      <WebcamCapture />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Prediction />
        <PredictButton />
      </div>
    </StyledContainer>
  );
};

export default PredictionPage;

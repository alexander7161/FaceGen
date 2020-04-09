import React from "react";
import { Container, Chip, Snackbar } from "@material-ui/core";
import styled from "styled-components";
import WebcamCapture from "../components/Webcam";
import { useSelector } from "react-redux";
import {
  predictionSelector,
  predictionErrorSelector,
  modelLoadingSelector,
  modelLoadingErrorSelector,
} from "../store/classifier/selector";
import PredictButton from "../components/PredictButton";
const StyledContainer = styled(Container)`
  margin-bottom: 64px;
`;

const Prediction = () => {
  const prediction = useSelector(predictionSelector);
  const predictionError = useSelector(predictionErrorSelector);
  const modelLoadingError = useSelector(modelLoadingErrorSelector);

  if (modelLoadingError) {
    return <>Model loading error</>;
  }

  if (predictionError) {
    return <>error</>;
  }

  return (
    <>
      {prediction?.map((p) => (
        <Chip key={p} label={p} />
      ))}
    </>
  );
};

const PredictionPage = () => {
  const modelLoading = useSelector(modelLoadingSelector);
  const [webcamError, setWebcamError] = React.useState(false);

  return (
    <>
      <StyledContainer maxWidth="sm">
        {webcamError && <>Webcam error</>}
        <WebcamCapture onError={(error: string) => setWebcamError(true)} />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Prediction />
        </div>
        <PredictButton disabled={webcamError} />
      </StyledContainer>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={modelLoading}
        message="Model loading"
      />
    </>
  );
};

export default PredictionPage;

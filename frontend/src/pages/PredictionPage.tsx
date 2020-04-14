import React from "react";
import { Container, Snackbar, Typography } from "@material-ui/core";
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
import PredictionLabelsComponent from "../components/PredictionLabelsComponent";

const StyledContainer = styled(Container)`
  margin-bottom: 64px;
`;
/**
 * Component to show the current prediction.
 */
const Prediction = () => {
  const prediction = useSelector(predictionSelector);
  const predictionError = useSelector(predictionErrorSelector);
  const modelLoadingError = useSelector(modelLoadingErrorSelector);

  if (modelLoadingError) {
    return <>Model loading error</>;
  }

  if (predictionError || prediction === undefined) {
    return <>error</>;
  }

  return <PredictionLabelsComponent predictions={prediction} />;
};

/**
 * Page to allow users to classify their own face using the webcam.
 * Displays a square webcam input.
 * The current Prediction
 * A button to load the model and start prediction
 * A snackbar to show when the model is currently loading.
 */
const PredictionPage = () => {
  const modelLoading = useSelector(modelLoadingSelector);
  const [webcamError, setWebcamError] = React.useState(false);

  return (
    <>
      <StyledContainer maxWidth="sm">
        {webcamError && <>Webcam error</>}
        <WebcamCapture onError={(error: string) => setWebcamError(true)} />
        <Typography>
          Please position your face in the centre of the image for best
          accuracy.
        </Typography>
        <Prediction />
      </StyledContainer>
      <PredictButton disabled={webcamError} />
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

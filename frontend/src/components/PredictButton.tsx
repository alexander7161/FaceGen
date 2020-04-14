import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import {
  predictingSelector,
  modelLoadingSelector,
} from "../store/classifier/selector";
import {
  startWebcamPrediction,
  stopWebcamPrediction,
} from "../store/classifier";
import FixedFab from "./FixedFab";

/**
 * Button to start preditive webcam classification.
 * Loads the model and then starts predicting once per second.
 */
const PredictButton = ({ disabled }: { disabled?: boolean }) => {
  const dispatch = useDispatch();
  const predicting = useSelector(predictingSelector);
  const modelLoading = useSelector(modelLoadingSelector);

  const predict = React.useCallback(() => {
    const dispatchFunc = predicting
      ? stopWebcamPrediction
      : startWebcamPrediction;
    dispatch(dispatchFunc());
  }, [dispatch, predicting]);

  const buttonText = predicting ? "Stop" : "Start";

  return (
    <FixedFab
      onClick={predict}
      variant="extended"
      color="primary"
      disabled={disabled || modelLoading}
    >
      {modelLoading ? <CircularProgress /> : buttonText}
    </FixedFab>
  );
};

export default PredictButton;

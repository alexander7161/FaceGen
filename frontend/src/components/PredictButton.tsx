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
import AbsoluteFab from "./AbsoluteFab";

const PredictButton = ({ disabled }: { disabled?: boolean }) => {
  const dispatch = useDispatch();
  const predicting = useSelector(predictingSelector);
  const modelLoading = useSelector(modelLoadingSelector);

  const predict = () => {
    if (predicting) {
      dispatch(stopWebcamPrediction());
    } else {
      dispatch(startWebcamPrediction());
    }
  };
  return (
    <AbsoluteFab
      onClick={predict}
      variant="extended"
      color="primary"
      disabled={disabled || modelLoading}
    >
      {modelLoading ? <CircularProgress /> : predicting ? "Stop" : "Start"}
    </AbsoluteFab>
  );
};

export default PredictButton;

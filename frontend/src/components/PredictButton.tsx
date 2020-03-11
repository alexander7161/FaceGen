import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Add from "@material-ui/icons/Add";
import { Fab, CircularProgress } from "@material-ui/core";
import { predictionLoadingSelector } from "../store/classifier/selector";
import { predictImage } from "../store/classifier";

const AddIcon = styled(Add)`
  margin-right: 4px;
`;

const AbsoluteFab = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 16px;
  min-width: 100px;
`;

const PredictButton = () => {
  const dispatch = useDispatch();
  const predictionLoading = useSelector(predictionLoadingSelector);

  const predict = () => {
    let image = document.getElementById("webcam");
    if (image) {
      dispatch(predictImage(image as HTMLVideoElement));
    } else {
      while (!image) {
        image = document.getElementById("webcam");
        dispatch(predictImage(image as HTMLVideoElement));
      }
    }
  };
  return (
    <AbsoluteFab
      onClick={predict}
      variant="extended"
      color="primary"
      disabled={predictionLoading}
    >
      {predictionLoading ? <CircularProgress /> : <>Predict</>}
    </AbsoluteFab>
  );
};

export default PredictButton;

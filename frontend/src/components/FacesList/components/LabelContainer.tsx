import React from "react";
import { LinearProgress } from "@material-ui/core";
import PredictionLabelsComponent from "../../PredictionLabelsComponent";

/**
 * Displays generated labels for face.
 * If there is an error nothing is shown.
 * If labels are loading a progress bar is shown.
 */
const LabelContainer = ({ f }: { f: GeneratedFaceData }) => {
  if (!f || f.error || !f) {
    return null;
  }

  if (f.labelsLoading) {
    return <LinearProgress />;
  }

  if (f.labelsLoading === false) {
    return <PredictionLabelsComponent predictions={f.labels} />;
  }

  return null;
};

export default LabelContainer;

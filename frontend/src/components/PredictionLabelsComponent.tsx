import React from "react";
import { Chip } from "@material-ui/core";

/**
 * Reusable component to show the prediction labels in chips from Material UI.
 */
const PredictionLabelsComponent = ({
  predictions,
}: {
  predictions: string[];
}) => {
  return (
    <div>
      {predictions.map((l) => (
        <Chip key={l} label={l} />
      ))}
    </div>
  );
};

export default PredictionLabelsComponent;

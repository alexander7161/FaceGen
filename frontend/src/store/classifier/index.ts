import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as tf from "@tensorflow/tfjs";

/**
 * Redux store for webcam classifier.
 * loads and stores the model.
 * Stores predictions from the model.
 */
const initialState: {
  model: {
    loading: boolean;
    model: null | tf.LayersModel;
    loaded: boolean;
    error: null | Error;
  };
  prediction: {
    prediction?: string[];
    prediciting: boolean;
    error: null | Error;
  };
} = {
  model: {
    loading: false,
    model: null,
    loaded: false,
    error: null,
  },
  prediction: {
    prediction: undefined,
    prediciting: false,
    error: null,
  },
};

const classifierSlice = createSlice({
  name: "classifier",
  initialState,
  reducers: {
    // Action to load the model. Resets the model state.
    loadModel(state) {
      state.model.loading = true;
      state.model.error = null;
      state.model.loaded = false;
    },
    // On model loading success.
    loadModelSuccess(state, action: PayloadAction<tf.LayersModel>) {
      state.model.loading = false;
      state.model.model = action.payload;
      state.model.loaded = true;
    },
    // Model loading failure
    loadModelFailure(state, action: PayloadAction<Error>) {
      state.model.loading = false;
      state.model.error = action.payload;
      state.model.loaded = false;
    },
    // Action to set predicting to true.
    startWebcamPrediction(state) {
      state.prediction.prediciting = true;
      state.prediction.error = null;
    },
    // Action to stop webcam predicting and reset prediction state.
    stopWebcamPrediction(state) {
      state.prediction.prediciting = false;
      state.prediction.prediction = undefined;
      state.prediction.error = null;
    },
    // Set the current prediction in state.
    predictionSuccess(state, action: PayloadAction<string[]>) {
      state.prediction.prediction = action.payload;
    },
    // Prediction failure action.
    predictionFailure(state, action: PayloadAction<Error>) {
      state.prediction.error = action.payload;
      state.prediction.prediction = undefined;
    },
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = classifierSlice;
// Extract and export each action creator by name
export const {
  loadModel,
  loadModelSuccess,
  loadModelFailure,
  startWebcamPrediction,
  stopWebcamPrediction,
  predictionSuccess,
  predictionFailure,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as tf from "@tensorflow/tfjs";

const initialState: {
  loading: boolean;
  modelLoadingError: null | Error;
  model: null | tf.LayersModel;
  modelLoaded: boolean;
  prediction?: string[];
  prediciting: boolean;
  predictionError: null | Error;
} = {
  loading: false,
  modelLoadingError: null,
  model: null,
  modelLoaded: false,
  prediction: undefined,
  prediciting: false,
  predictionError: null
};

const classifierSlice = createSlice({
  name: "classifier",
  initialState,
  reducers: {
    loadModel(state) {
      state.loading = true;
      state.modelLoadingError = null;
      state.modelLoaded = false;
    },
    loadModelSuccess(state, action: PayloadAction<tf.LayersModel>) {
      state.loading = false;
      state.model = action.payload;
      state.modelLoaded = true;
    },
    loadModelFailure(state, action: PayloadAction<Error>) {
      state.loading = false;
      state.modelLoadingError = action.payload;
      state.modelLoaded = false;
    },
    startWebcamPrediction(state) {
      state.prediciting = true;
      state.predictionError = null;
    },
    stopWebcamPrediction(state) {
      state.prediciting = false;
      state.prediction = undefined;
      state.predictionError = null;
    },
    predictionSuccess(state, action: PayloadAction<string[]>) {
      state.prediction = action.payload;
    },
    predictionFailure(state, action: PayloadAction<Error>) {
      state.predictionError = action.payload;
    }
  }
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
  predictionFailure
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

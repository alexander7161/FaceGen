import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as tf from "@tensorflow/tfjs";

const initialState: {
  loading: boolean;
  error: null | Error;
  model: null | tf.LayersModel;
  modelLoaded: boolean;
  prediction?: string[];
  predictionLoading: boolean;
  predictionError: null | Error;
} = {
  loading: false,
  error: null,
  model: null,
  modelLoaded: false,
  prediction: undefined,
  predictionLoading: false,
  predictionError: null
};

const classifierSlice = createSlice({
  name: "classifier",
  initialState,
  reducers: {
    loadModel(state) {
      state.loading = true;
      state.error = null;
      state.modelLoaded = false;
    },
    loadModelSuccess(state, action: PayloadAction<tf.LayersModel>) {
      state.loading = false;
      state.model = action.payload;
      state.modelLoaded = true;
    },
    loadModelFailure(state, action: PayloadAction<Error>) {
      state.loading = false;
      state.error = action.payload;
      state.modelLoaded = false;
    },
    predictImage(
      state,
      action: PayloadAction<
        | tf.backend_util.PixelData
        | ImageData
        | HTMLImageElement
        | HTMLCanvasElement
        | HTMLVideoElement
      >
    ) {
      state.predictionLoading = true;
      state.predictionError = null;
    },
    predictionSuccess(state, action: PayloadAction<string[]>) {
      state.prediction = action.payload;
      state.predictionLoading = false;
    },
    predictionFailure(state, action: PayloadAction<Error>) {
      state.predictionLoading = false;
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
  predictImage,
  predictionSuccess,
  predictionFailure
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

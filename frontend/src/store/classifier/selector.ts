import { AppState } from "..";

export const classifierModelSelector = (state: AppState) =>
  state.classifier.model;

export const modelLoadedSelector = (state: AppState) =>
  state.classifier.modelLoaded;
export const modelLoadingErrorSelector = (state: AppState) =>
  state.classifier.modelLoadingError;
export const modelLoadingSelector = (state: AppState) =>
  state.classifier.loading;

export const predictionSelector = (state: AppState) =>
  state.classifier.prediction;
export const predictingSelector = (state: AppState) =>
  state.classifier.prediciting;
export const predictionErrorSelector = (state: AppState) =>
  state.classifier.predictionError;

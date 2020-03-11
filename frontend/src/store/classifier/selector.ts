import { AppState } from "..";

export const classifierModelSelector = (state: AppState) =>
  state.classifier.model;

export const modelLoadedSelector = (state: AppState) =>
  state.classifier.modelLoaded;
export const modelErrorSelector = (state: AppState) => state.classifier.error;
export const modelLoadingSelector = (state: AppState) =>
  state.classifier.loading;

export const predictionSelector = (state: AppState) =>
  state.classifier.prediction;
export const predictionLoadingSelector = (state: AppState) =>
  state.classifier.predictionLoading;
export const predictionErrorSelector = (state: AppState) =>
  state.classifier.predictionError;

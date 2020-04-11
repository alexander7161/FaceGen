import { AppState } from "..";
/**
 * Selectors for Classifier redux state
 */

export const classifierModelSelector = (state: AppState) =>
  state.classifier.model.model;

export const modelLoadedSelector = (state: AppState) =>
  state.classifier.model.loaded;
export const modelLoadingErrorSelector = (state: AppState) =>
  state.classifier.model.error;
export const modelLoadingSelector = (state: AppState) =>
  state.classifier.model.loading;

export const predictionSelector = (state: AppState) =>
  state.classifier.prediction.prediction;
export const predictingSelector = (state: AppState) =>
  state.classifier.prediction.prediciting;
export const predictionErrorSelector = (state: AppState) =>
  state.classifier.prediction.error;

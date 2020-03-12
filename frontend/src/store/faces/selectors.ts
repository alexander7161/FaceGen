import { AppState } from "..";

export const facesSelector = (state: AppState) => state.faces.faces;

export const facesLoadingSelector = (state: AppState) => state.faces.loading;

export const faceSelector = (index: number) => (state: AppState) =>
  state.faces.faces && state.faces.faces[index];

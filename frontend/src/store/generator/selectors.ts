import { AppState } from "..";

export const selectGenerateLoading = (state: AppState) =>
  state.generator.loading;

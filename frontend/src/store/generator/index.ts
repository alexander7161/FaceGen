import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  loading: boolean;
  error: false | Error;
} = {
  loading: false,
  error: false
};

const generatorSlice = createSlice({
  name: "generator",
  initialState,
  reducers: {
    goToGeneratePage(state) {},
    generateFace(state) {
      state.loading = true;
      state.error = false;
    },
    generateFaceSuccess(state) {
      state.loading = false;
    },
    generateFaceFailure(state, action: PayloadAction<Error>) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});
// Extract the action creators object and the reducer
const { actions, reducer } = generatorSlice;
// Extract and export each action creator by name
export const {
  generateFace,
  generateFaceSuccess,
  generateFaceFailure,
  goToGeneratePage
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

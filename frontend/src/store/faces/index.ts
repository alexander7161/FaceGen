import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  faces: GeneratedFaceData[] | null;
  error: Error | null;
} = {
  faces: null,
  error: null
};

const facesSlice = createSlice({
  name: "faces",
  initialState,
  reducers: {
    receiveFaces(state, action: PayloadAction<GeneratedFaceData[] | null>) {
      state.faces = action.payload;
      state.error = null;
    }
  }
});
// Extract the action creators object and the reducer
const { actions, reducer } = facesSlice;
// Extract and export each action creator by name
export const { receiveFaces } = actions;
// Export the reducer, either as a default or named export
export default reducer;

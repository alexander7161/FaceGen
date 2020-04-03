import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  faces: GeneratedFaceData[] | null;
  error: Error | null;
  loading: boolean;
} = {
  faces: null,
  error: null,
  loading: true
};

const facesSlice = createSlice({
  name: "faces",
  initialState,
  reducers: {
    receiveFaces(state, action: PayloadAction<GeneratedFaceData[] | null>) {
      state.faces = action.payload;
      state.error = null;
      state.loading = false;
    },
    deleteFace(state, action: PayloadAction<string>) {},
    deleteAllFaces(state) {}
  }
});
// Extract the action creators object and the reducer
const { actions, reducer } = facesSlice;
// Extract and export each action creator by name
export const { receiveFaces, deleteFace, deleteAllFaces } = actions;
// Export the reducer, either as a default or named export
export default reducer;

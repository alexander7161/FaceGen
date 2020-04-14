import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  faces: GeneratedFaceData[] | null;
  error: Error | null;
  loading: boolean;
} = {
  faces: null,
  error: null,
  loading: true,
};
/**
 * Redux state to store current faces.
 * Synced from firestore.
 */
const facesSlice = createSlice({
  name: "faces",
  initialState,
  reducers: {
    // When new faces are recieved, set the faces array with the new data.
    receiveFaces(state, action: PayloadAction<GeneratedFaceData[] | null>) {
      state.faces = action.payload;
      state.error = null;
      state.loading = false;
    },
    // Delete a single faces based on ID.
    deleteFace(state, action: PayloadAction<string>) {},
    // Delete all faces belonging to a user.
    deleteAllFaces(state) {},
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = facesSlice;
// Extract and export each action creator by name
export const { receiveFaces, deleteFace, deleteAllFaces } = actions;
// Export the reducer, either as a default or named export
export default reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  user: firebase.User | null;
  userData: UserData | null;
  error: Error | null;
} = {
  user: null,
  userData: null,
  error: null,
};

/**
 * Redux state to store user data.
 */
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Set user object.
    setUser(state, action: PayloadAction<firebase.User | null>) {
      state.user = action.payload;
      state.error = null;
    },
    // Set user error.
    setUserError(state, action: PayloadAction<Error | null>) {
      state.error = action.payload;
    },
    // Set the data for the current user.
    setUserData(state, action: PayloadAction<UserData | null>) {
      state.userData = action.payload;
      state.error = null;
    },
    // Error on fetching user data.
    setUserDataError(state, action: PayloadAction<Error | null>) {
      state.error = action.payload;
    },
    // Sign out current user, stop all firestore syncs.
    signOut() {},
    // Sign in anonymously.
    signInAnonymously(state, action) {},
    // Sign in with google.
    signInWithGoogle() {},
    // Delete the current user.
    deleteUser() {},
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = userSlice;
// Extract and export each action creator by name
export const {
  setUser,
  setUserError,
  signOut,
  setUserData,
  signInAnonymously,
  signInWithGoogle,
  deleteUser,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

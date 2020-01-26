import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  user: firebase.User | null;
  userData: UserData | null;
  error: Error | null;
} = {
  user: null,
  userData: null,
  error: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<firebase.User | null>) {
      state.user = action.payload;
      state.error = null;
    },
    setUserError(state, action: PayloadAction<Error | null>) {
      state.error = action.payload;
    },
    setUserData(state, action: PayloadAction<UserData | null>) {
      state.userData = action.payload;
      state.error = null;
    },
    setUserDataError(state, action: PayloadAction<Error | null>) {
      state.error = action.payload;
    },
    signIn(state, action) {},
    signOut() {},
    signInAnonymously(state, action) {},
    signInWithGoogle() {},
    deleteUser() {}
  }
});
// Extract the action creators object and the reducer
const { actions, reducer } = userSlice;
// Extract and export each action creator by name
export const {
  setUser,
  setUserError,
  signIn,
  signOut,
  setUserData,
  signInAnonymously,
  signInWithGoogle,
  deleteUser
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

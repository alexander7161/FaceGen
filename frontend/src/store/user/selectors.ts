import { AppState } from "..";

export const userSelector = (state: AppState) => state.user.user;
export const userIdSelector = (state: AppState) => state.user.user?.uid;

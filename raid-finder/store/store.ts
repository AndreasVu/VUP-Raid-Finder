import { combineReducers, configureStore } from "@reduxjs/toolkit";
import signalRSlice from "./raidCodeSlice";

const reducer = combineReducers({
  signalR: signalRSlice.reducer,
});

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

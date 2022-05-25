import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Raid, RaidCode, RaidCodeFromApi } from "../models/raid-model";
import { getRaids, SignalRController } from "../signalRController";
import { v4 as uuidv4 } from "uuid";
import { SelectedRaidsKey } from "../constants/localStorageKeys";
import { RootState } from "./store";

export interface SignalRState {
  controller: SignalRController;
  raids: Record<number, RaidCode[]>;
  subscribedRaids: Raid[];
  availableRaids: Raid[];
}

const initialState = {
  controller: new SignalRController(),
  raids: {},
  subscribedRaids: [],
  availableRaids: [],
} as SignalRState;

const signalRSlice = createSlice({
  name: "signalR",
  initialState,
  reducers: {
    subscribe(state, action: PayloadAction<Raid>) {
      console.log("subscribing");
      state.controller.subscribeToRaid(action.payload.id);
      state.subscribedRaids.push(action.payload);
      updateLocalStore(action.payload, "add");
    },
    unsubscribe(state, action: PayloadAction<Raid>) {
      state.controller.unsubscribeToRaid(action.payload.id);
      state.subscribedRaids = state.subscribedRaids.filter(
        (r) => r.id !== action.payload.id
      );
      updateLocalStore(action.payload, "remove");
    },
    setAvailableraids(state, action: PayloadAction<Raid[]>) {
      state.availableRaids = action.payload;
    },
    setIsUsed(
      state,
      action: PayloadAction<{ raidId: number; codeId: string }>
    ) {
      const newList = state.raids[action.payload.raidId].map((r) => {
        if (r.id === action.payload.codeId) {
          return { ...r, isUsed: true };
        } else {
          return r;
        }
      });

      state.raids[action.payload.raidId] = newList;
    },
    raidCodeAdded(state, action: PayloadAction<RaidCodeFromApi>) {
      let list = state.raids[action.payload.raidId];
      if (list === undefined) list = [];

      list.unshift({
        id: uuidv4(),
        code: action.payload.code,
        isUsed: false,
        tweetedAt: new Date(action.payload.tweetTime),
      });

      state.raids[action.payload.raidId] = list;
    },
    populateSelectedRaids(state) {
      state.subscribedRaids = getLocalstorage<Raid[]>(SelectedRaidsKey) ?? [];
      for (const raid of state.subscribedRaids) {
        console.log("subscribing to raid", raid.englishName);
        state.controller.subscribeToRaid(raid.id);
      }
    },
  },
});

export const fetchRaids = createAsyncThunk(
  "signalR/fetchRaids",
  async (_, thunkApi) => {
    const raids = await getRaids();
    thunkApi.dispatch(setAvailableraids(raids));
  }
);

export const startController = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("signalR/start", async (_, thunkApi) => {
  const state = thunkApi.getState();
  await state.signalR.controller.start();
  console.log("exiting thunk");
});

const updateLocalStore = (raid: Raid, action: "add" | "remove") => {
  let raids = getLocalstorage<Raid[]>(SelectedRaidsKey) ?? [];

  if (action == "add") {
    raids.push(raid);
  } else {
    raids = raids.filter((r) => r.id !== raid.id);
  }

  localStorage.setItem(SelectedRaidsKey, JSON.stringify(raids));
};

const getLocalstorage = <T>(key: string) => {
  const content = localStorage.getItem(key);

  if (content === null) return null;

  return JSON.parse(content) as T;
};

export const {
  subscribe,
  unsubscribe,
  setAvailableraids,
  raidCodeAdded,
  setIsUsed,
  populateSelectedRaids,
} = signalRSlice.actions;

export default signalRSlice;

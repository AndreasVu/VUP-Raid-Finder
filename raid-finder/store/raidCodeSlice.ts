import {
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { Raid, RaidCode, RaidCodeFromApi } from "../models/raid-model";
import { getRaids, SignalRController } from "../signalRController";
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
    start(state) {
      state.controller.start();
    },
    subscribe(state, action: PayloadAction<Raid>) {
      state.controller.subscribeToRaid(action.payload.id);
      state.subscribedRaids.push(action.payload);
    },
    unsubscribe(state, action: PayloadAction<Raid>) {
      state.controller.unsubscribeToRaid(action.payload.id);
      state.subscribedRaids.filter((r) => r.id !== action.payload.id);
    },
    setAvailableraids(state, action: PayloadAction<Raid[]>) {
      state.availableRaids = action.payload;
    },
    raidCodeAdded(state, action: PayloadAction<RaidCodeFromApi>) {
      let list = state.raids[action.payload.raidId];
      if (list === undefined) list = [];

      list.push({
        code: action.payload.code,
        isUsed: false,
        tweetedAt: action.payload.tweetTime,
      });

      state.raids[action.payload.raidId] = list;
    },
  },
});

const handleNewRaids: (
  raidCodes: Record<number, RaidCode[]>
) => (raidCode: RaidCodeFromApi) => void = (
  raidCodes: Record<number, RaidCode[]>
) => {
  return (raidCode: RaidCodeFromApi) => {
    let raidCodeList = raidCodes[raidCode.raidId];
    if (raidCodeList === undefined) raidCodeList = [];

    raidCodeList.unshift({
      code: raidCode.code,
      isUsed: false,
      tweetedAt: raidCode.tweetTime,
    });
  };
};

export const fetchRaids = createAsyncThunk(
  "signalR/fetchRaids",
  async (_, thunkApi) => {
    const raids = await getRaids();
    thunkApi.dispatch(setAvailableraids(raids));
  }
);

export const {
  start,
  subscribe,
  unsubscribe,
  setAvailableraids,
  raidCodeAdded,
} = signalRSlice.actions;

export default signalRSlice;

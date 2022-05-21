import { Raid } from "./raid-model";

export default interface SignalRContext {
  start(): Promise<void>;
  stop(): Promise<void>;
  subscribeToRaid(raidId: number): Promise<void>;
  unsubscribeToRaid(raidId: number): Promise<void>;
  getAvailableRaids(): Promise<Raid[]>;
}

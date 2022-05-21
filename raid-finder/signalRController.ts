import type { Raid, RaidCodeFromApi } from "./models/raid-model";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { ReceiveRaidCode } from "./constants/signalRMethods";
import { RaidsKey } from "./constants/localStorageKeys";
import { store } from "./store/store";
import { raidCodeAdded } from "./store/raidCodeSlice";

export class SignalRController {
  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("https://vups.xyz/raid-code-hub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on(ReceiveRaidCode, (raid) => {
      store.dispatch(raidCodeAdded(raid));
    });
  }

  async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(this.start, 5000);
    }
  }

  async stop() {
    await this.connection.stop();
  }

  async subscribeToRaid(raidId: number) {
    await this.connection.invoke("Subscribe", raidId);
  }

  async unsubscribeToRaid(raidId: number) {
    await this.connection.invoke("Unsubscribe", raidId);
  }

  async getAvailableRaids(): Promise<Raid[]> {
    return await this.connection.invoke("GetAvailableRaids");
  }
}

export const getRaids = async (): Promise<Raid[]> => {
  let localStorageValue = localStorage.getItem(RaidsKey);
  if (localStorageValue) {
    return JSON.parse(localStorageValue);
  }

  let controller = new SignalRController();
  await controller.start();
  let result = await controller.getAvailableRaids();
  localStorage.setItem("raids", JSON.stringify(result));
  await controller.stop();
  return result;
};

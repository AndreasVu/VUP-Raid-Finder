import type { Raid, RaidCodeFromApi } from "../interfaces/RaidCode";
import {
  HubConnectionBuilder,
  HubConnection,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import { ReceiveRaidCode } from "../constants/signalRMethods";

export class SignalRController {
  private connection: HubConnection;
  onNewRaid: (raid: RaidCodeFromApi) => void;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl("http://vups.xyz:1234/raid-code-hub", {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.connection.on(ReceiveRaidCode, (raid) => {
      if (this.onNewRaid) this.onNewRaid(raid);
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

  async subscribeToRaid(raidId: number) {
    console.log(raidId);
    await this.connection.invoke("Subscribe", raidId);
  }

  async unsubscribeToRaid(raidId: number) {
    await this.connection.invoke("Unsubscribe", raidId);
  }

  async getAvailableRaids(): Promise<Raid[]> {
    return await this.connection.invoke("GetAvailableRaids");
  }
}

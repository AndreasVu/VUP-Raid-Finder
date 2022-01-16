import type { Writable } from "svelte/store";
import type { RaidCode } from "./interfaces/RaidCode";
import { SignalRController } from "./services/signalRController";
import { writable } from "svelte/store";
import type { Raid } from "./interfaces/RaidCode";
import { RaidsKey } from "./constants/localStorageKeys";

export class RaidCodeStore {
  private raidCodes = new Map<number, Writable<RaidCode[]>>();
  private listMaxLength = 30;
  private signalRController: SignalRController;

  constructor(controller: SignalRController) {
    this.signalRController = controller;

    this.signalRController.onNewRaid = (newRaid) => {
      var newRaidCode: RaidCode = {
        code: newRaid.code,
        tweetedAt: newRaid.tweetTime,
        isUsed: false,
      };

      const raidCodeList = this.raidCodes.get(newRaid.raidId);
      raidCodeList.update((list) => {
        const newList = [newRaidCode, ...list];
        if (newList.length > this.listMaxLength) {
          newList.pop();
        }
        return newList;
      });
    };
  }

  async populateRaidCodeLists() {
    for (var raid of await getRaids()) {
      this.raidCodes.set(raid.id, writable([]));
    }
  }

  subscribeToRaid = async (raidId: number): Promise<Writable<RaidCode[]>> => {
    await this.signalRController.subscribeToRaid(raidId);
    var writer = this.raidCodes.get(raidId);

    return writer;
  };

  unsubscribeToRaid = async (raidId: number) =>
    await this.signalRController.unsubscribeToRaid(raidId);
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

export interface RaidCode {
  code: string;
  tweetedAt: string;
  isUsed: boolean;
}

export interface Raid {
  id: number;
  englishName: string;
  japaneseName: string;
  category: string;
  element: string;
}

export interface RaidCodeFromApi {
  raidId: number;
  code: string;
  tweetTime: string;
}

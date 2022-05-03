export interface Raid {
  twitchId: string;
  toTwitchChannel: string;
  fromTwitchChannel: string;
  raidAmount: number;
  createdAt: number;
  modifiedAt: number;
  botVersion: string;
}

export interface User {
  twitchId: string;
  twitchName: string;
  email: string;
  createdAt: number;
  modifiedAt: number;
}

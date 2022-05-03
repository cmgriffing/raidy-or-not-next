import { TableName } from "./../types/db";
import { database, transformToData, transformToModel } from "../utils/knex";
import { Raid } from "../../types/models";

export async function createRaid(raid: Raid) {
  const transformedRaid = transformToData({ ...raid });
  console.log({ transformedRaid });
  await database(TableName.Raids).insert(transformedRaid);
}

export async function getIncomingRaids(
  twitchId: string,
  twitchChannel: string
): Promise<Raid[]> {
  return database(TableName.Raids)
    .select("*")
    .where({
      twitch_id: twitchId,
      to_twitch_channel: twitchChannel,
    })
    .then(transformToModel) as Promise<Raid[]>;
}

export async function getOutgoingRaids(
  twitchId: string,
  twitchChannel: string
): Promise<Raid[]> {
  return database(TableName.Raids)
    .select("*")
    .where({
      twitch_id: twitchId,
      from_twitch_channel: twitchChannel,
    })
    .then(transformToModel) as Promise<Raid[]>;
}

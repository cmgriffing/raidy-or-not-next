import { getUserFromTokenMiddleware } from "../../server/utils/middleware";
import {
  getIncomingRaids,
  getOutgoingRaids,
  Raid,
} from "../../server/repositories/raids";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../server/repositories/users";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }

  let user: Omit<User, "email">;
  try {
    user = await getUserFromTokenMiddleware(req);
  } catch (e) {
    res.status(401).end();
    return;
  }

  try {
    const rawIncomingRaids = await getIncomingRaids(
      user.twitchId,
      user.twitchName
    );

    const rawOutgoingRaids = await getOutgoingRaids(
      user.twitchId,
      user.twitchName
    );

    const incomingRaidCountsSet: Record<string, number> = {};

    const sortedRawIncomingRaids = rawIncomingRaids.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    const sortedRawOutgoingRaids = rawOutgoingRaids.sort(
      (a, b) => a.createdAt - b.createdAt
    );

    const incomingRaidsMap: Record<string, Raid> = {};
    const outgoingRaidsMap: Record<string, Raid> = {};

    sortedRawIncomingRaids.forEach((raid) => {
      incomingRaidsMap[raid.fromTwitchChannel] = raid;
    });

    sortedRawOutgoingRaids.forEach((raid) => {
      outgoingRaidsMap[raid.toTwitchChannel] = raid;
    });

    const incomingRaids = Object.values(incomingRaidsMap).sort(
      (a, b) => b.createdAt - a.createdAt
    );

    const outgoingRaids = Object.values(outgoingRaidsMap).sort(
      (a, b) => a.createdAt - b.createdAt
    );

    res.status(200).json({
      incomingRaids,
      outgoingRaids,
    });
  } catch (e: any) {
    console.log({ e });
    res.status(500).end();
  }
}

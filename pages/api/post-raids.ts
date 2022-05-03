import { createRaid } from "../../server/repositories/raids";
import { getUserFromApiKeyMiddleware } from "../../server/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../server/repositories/users";
import { Raid } from "../../types/models";
import { postRaidRequestSchema } from "../../types/request-schemas";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  let user: Omit<User, "email">;
  try {
    user = await getUserFromApiKeyMiddleware(req);
  } catch (e) {
    res.status(401).end();
    return;
  }

  try {
    if (!postRaidRequestSchema.safeParse(req.body).success) {
      res.status(400).end();
      return;
    }

    const body: Raid = req.body;

    const now = Math.round(Date.now() / 1000);

    const createResult = await createRaid({
      ...body,
      twitchId: user?.twitchId?.trim(),
      createdAt: now,
      modifiedAt: now,
    });

    res.status(200).end();
  } catch (e: any) {
    console.log({ e });
    res.status(500).end();
  }
}

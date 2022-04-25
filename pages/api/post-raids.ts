import { createRaid, Raid } from "../../server/repositories/raids";
import { getUserFromApiKeyMiddleware } from "../../server/utils/middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../server/repositories/users";

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
    res.status(400).end();
    return;
  }

  console.log({ user });

  try {
    const body: Raid = req.body;

    // validate raid body

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

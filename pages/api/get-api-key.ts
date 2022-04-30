import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromTokenMiddleware } from "../../server/utils/middleware";
import { getApiKey, User } from "../../server/repositories/users";

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
  } catch (e: unknown) {
    res.status(401).end();
    return;
  }

  try {
    const apiKey = await getApiKey(user?.twitchId);

    res.status(200).json({
      apiKey,
    });
  } catch (e: unknown) {
    console.log({ e });
    res.status(500).end();
  }
}

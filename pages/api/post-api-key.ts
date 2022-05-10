import { getUserFromTokenMiddleware } from "../../server/utils/middleware";
import { getApiKey, setApiKey, User } from "../../server/repositories/users";
import { nanoid } from "../../server/utils/nanoid";
import type { NextApiRequest, NextApiResponse } from "next";
import { encodeApiKeyToken } from "../../server/utils/jwt";

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
    user = await getUserFromTokenMiddleware(req);
  } catch (e) {
    res.status(401).end();
    return;
  }

  try {
    const apiKey = nanoid();
    await setApiKey(user.twitchId, apiKey);
    res.status(200).json({ token: encodeApiKeyToken(user.twitchName, apiKey) });
  } catch (e: any) {
    console.log({ e });
    res.status(500).end();
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../server/repositories/users";
import { getUserFromApiKeyMiddleware } from "../../server/utils/middleware";

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
    res.status(204).end();
  } catch (e: any) {
    console.log({ e });
    res.status(500).end();
  }
}

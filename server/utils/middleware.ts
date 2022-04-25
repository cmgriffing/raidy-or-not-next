import { NextApiRequest } from "next";
import { User } from "./../repositories/users";
import { getUser, getUserByApiKey } from "../repositories/users";
import { decodeToken } from "./jwt";

export async function getUserFromTokenMiddleware(req: NextApiRequest) {
  try {
    const authHeader: string = req?.headers?.authorization as string;
    const token = authHeader.replace("Bearer ", "");

    const {
      sub: {
        user: { twitchId },
      },
    } = decodeToken(token) as any;

    if (!twitchId) {
      throw new Error("Token did not contain twitchId");
    }

    const user = await getUser(twitchId);

    if (!user?.twitchId) {
      throw new Error(`User with twitchId (${twitchId}) does not exist`);
    }

    return user;
  } catch (error) {
    console.log({ error });
    throw new Error("JWT Auth failed");
  }
}

export async function getUserFromApiKeyMiddleware(req: NextApiRequest) {
  try {
    const authHeader: string = req?.headers?.authorization as string;
    const apiKey = authHeader.replace("ApiKey ", "");

    const user: User = await getUserByApiKey(apiKey);

    return user;
  } catch (error) {
    console.log({ error });
    throw new Error("API Key auth failed");
  }
}

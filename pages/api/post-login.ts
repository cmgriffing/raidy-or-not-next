import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { createUser, getFullUser } from "../../server/repositories/users";
import { encodeAccessToken } from "../../server/utils/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).end();
      return;
    }

    const twitchResponse = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        redirect_uri: process.env.TWITCH_REDIRECT_URL,
        grant_type: "authorization_code",
        code,
      }
    );

    const userResponse = await axios.get("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${twitchResponse.data.access_token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID || "",
      },
    });

    const { id, login, email } = userResponse.data.data[0];

    let existingUser = await getFullUser(id);
    if (!existingUser?.twitchId) {
      const now = Math.round(Date.now() / 1000);
      existingUser = {
        twitchId: id,
        twitchName: login,
        email,
        createdAt: now,
        modifiedAt: now,
      };
      await createUser(existingUser);
    }

    const authToken = encodeAccessToken(existingUser);

    res.status(200).json({
      authToken: authToken,
      twitchToken: twitchResponse.data.access_token,
    });
  } catch (e: any) {
    console.log({ e });
    res.status(500).end();
  }
}

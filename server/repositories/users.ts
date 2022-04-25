import { database, transformToData, transformToModel } from "../utils/knex";
import { TableName } from "../types/db";
import { nanoid } from "../utils/nanoid";

export interface User {
  twitchId: string;
  twitchName: string;
  email: string;
  createdAt: number;
  modifiedAt: number;
}

export async function createUser(userData: User) {
  const { twitchId, twitchName, createdAt, modifiedAt, email } = userData;

  const user = await database(TableName.Users).insert(
    transformToData({
      twitchId,
      twitchName,
      createdAt,
      modifiedAt,
    })
  );

  const userEmail = await database(TableName.UsersEmail).insert(
    transformToData({ twitchId, email, createdAt, modifiedAt })
  );

  const apiKey = nanoid();
  const userApiKey = await database(TableName.UsersApiKey).insert(
    transformToData({ twitchId, createdAt, modifiedAt, apiKey })
  );
}

export async function getUser(twitchId: string): Promise<Omit<User, "email">> {
  const result = await database(TableName.Users)
    .first("*")
    .where({ twitch_id: twitchId });

  return transformToModel(result) as Omit<User, "email">;
}

export async function getFullUser(twitchId: string): Promise<User> {
  const result = await database(TableName.Users)
    .join(TableName.UsersEmail, "users.twitch_id", "=", "users_email.twitch_id")
    .first(
      "users.twitch_id",
      "users.twitch_name",
      "users_email.email",
      "users.created_at",
      "users.modified_at"
    )
    .where({ "users.twitch_id": twitchId });

  return transformToModel<User>(result) as User;
}

export async function getApiKey(twitchId: string): Promise<string> {
  const result = await database(TableName.UsersApiKey)
    .first("api_key")
    .where({ twitch_id: twitchId });

  return result.api_key;
}

export async function createApiKey(
  twitchId: string,
  apiKey: string
): Promise<void> {
  return database(TableName.UsersApiKey).insert(
    transformToData({ twitchId, apiKey })
  );
}

export async function setApiKey(
  twitchId: string,
  apiKey: string
): Promise<void> {
  return database(TableName.UsersApiKey)
    .where("twitch_id", "=", twitchId)
    .update("api_key", apiKey);
}

export async function getUserByApiKey(apiKey: string): Promise<User> {
  return database(TableName.UsersApiKey)
    .join(TableName.Users, "users_api_key.twitch_id", "=", "users.twitch_id")
    .join(
      TableName.UsersEmail,
      "users_api_key.twitch_id",
      "=",
      "users_email.twitch_id"
    )
    .first(
      "users.twitch_id",
      "users.twitch_name",
      "users_email.email",
      "users.created_at",
      "users.modified_at"
    )
    .where("users_api_key.api_key", "=", apiKey)
    .then((user) => {
      console.log({ user });
      if (!user) {
        console.log("user not found");
        throw new Error("User not found");
      }

      return transformToModel(user);
    }) as Promise<User>;
}

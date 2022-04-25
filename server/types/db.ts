export type DatabaseRecord = Record<string, string | number | boolean>;

export enum TableName {
  Users = "users",
  UsersEmail = "users_email",
  UsersApiKey = "users_api_key",
  Raids = "raids",
}

import knex from "knex";
import Case from "case";
import { DatabaseRecord } from "../types/db";

const { DB_STRING } = process.env;

export const database = knex({
  client: !DB_STRING ? "pg" : "cockroachdb",
  connection: DB_STRING || {
    host: "127.0.0.1",
    user: "postgres",
    port: 5442,
    password: "admin",
    database: "raidy_or_not",
  },
});

export function transformDataToModel(
  dataModel: Record<string, any>
): Record<string, any> {
  const newData: Record<string, any> = {};

  Object.entries(dataModel).forEach(([key, value]) => {
    let trimmedValue = value;
    if (value && typeof value === "string") {
      trimmedValue = value.trim();
    }

    newData[Case.camel(key)] = trimmedValue;
  });

  return newData;
}

export function transformModelToData(
  dataModel: Record<string, any>
): Record<string, any> {
  const newData: Record<string, any> = {};

  Object.entries(dataModel).forEach(([key, value]) => {
    newData[Case.snake(key)] = value;
  });

  return newData;
}

// TODO: should probably write some tests
export function transformToModel<T>(
  dataResult: DatabaseRecord | DatabaseRecord[]
): T | T[] {
  if (!dataResult) {
    return {} as T;
  } else if (typeof dataResult.indexOf === "function") {
    return (dataResult as DatabaseRecord[]).map(transformDataToModel) as T[];
  } else {
    return transformDataToModel(dataResult) as T;
  }
}

export function transformToData<T>(
  dataResult: DatabaseRecord | DatabaseRecord[]
): T | T[] {
  if (!dataResult) {
    return {} as T;
  } else if (typeof dataResult.indexOf === "function") {
    return (dataResult as DatabaseRecord[]).map(transformModelToData) as T[];
  } else {
    return transformModelToData(dataResult) as T;
  }
}

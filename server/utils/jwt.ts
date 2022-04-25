import jwt from "jsonwebtoken";
import { User } from "../repositories/users";

const { TOKEN_SIGNING_KEY = "TOTALLY A SECRET" } = process.env;

export function decodeToken(token: string) {
  return jwt.verify(token, TOKEN_SIGNING_KEY);
}

function encodeToken(user: User, type: "access" | "refresh") {
  let expiresIn = "24h";
  if (type === "refresh") {
    expiresIn = "7d";
  }

  return jwt.sign(
    {
      sub: { user },
      type,
    },
    TOKEN_SIGNING_KEY,
    { expiresIn }
  );
}

export function encodeAccessToken(user: User) {
  return encodeToken(user, "access");
}
export function encodeRefreshToken(user: User) {
  return encodeToken(user, "refresh");
}

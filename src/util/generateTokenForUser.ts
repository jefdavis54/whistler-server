import jwt from "jsonwebtoken";
import { SERVER_DEFAULT_TOKEN_EXPIRY } from "../lib/constants";
import { User } from "../lib/typsescriptInterfaces";

const generateTokenForUser = (user: User) => {
  let secret = "1234";
  if (typeof process.env.SERVER_SECRET === "string") {
    secret = process.env.SERVER_SECRET;
  } else {
    throw new Error("Environment variable for server secret is missing.");
  }
  return jwt.sign(
    { id: user.id, name: user.name, easyId: user.easyId, email: user.email },
    secret,
    {
      expiresIn: SERVER_DEFAULT_TOKEN_EXPIRY,
    },
  );
};

export default generateTokenForUser;

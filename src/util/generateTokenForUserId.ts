import jwt from "jsonwebtoken"
import { SERVER_DEFAULT_TOKEN_EXPIRY } from "../lib/constants"

const generateTokenForUserId = (userId: string) => {
  let secret = '1234'
  if (typeof process.env.SERVER_SECRET === "string") {
    secret = process.env.SERVER_SECRET
  } else {
    throw new Error('Environment variable for server secret is missing.')
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: SERVER_DEFAULT_TOKEN_EXPIRY,
  })
};

export default generateTokenForUserId;

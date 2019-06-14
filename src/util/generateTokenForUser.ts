import jwt from "jsonwebtoken";
import { SERVER_DEFAULT_TOKEN_EXPIRY } from "../lib/constants";
import { User } from "../lib/typsescriptInterfaces";
import { errRobj, dataStrRobj } from "./responseShaperSERVER";

const generateTokenForUser = (user: User) => {
  let secret = "1234";
  if (typeof process.env.SERVER_SECRET === "string") {
    secret = process.env.SERVER_SECRET;
  } else {
    return errRobj(
      "ERROR:SERVER:generateTokenForUser:: Environmental server secret variable not available.",
    );
  }
  const token = jwt.sign(
    { id: user.id, name: user.name, easyId: user.easyId, email: user.email },
    secret,
    {
      expiresIn: SERVER_DEFAULT_TOKEN_EXPIRY,
    },
  );
  return dataStrRobj([], token);
};

export default generateTokenForUser;

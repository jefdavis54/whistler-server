import jwt from "jsonwebtoken";
import { errObj, dataObj } from "./responseShaperSERVER";
import prismaResponse from "./responseShaperPRISMA";
import { ERR_01_NOT_AUTHORIZED } from "../lib/errorMessages";
import { PRISMA_ID_LENGTH } from "../lib/constants";
import { User, PrismaCtx } from "../lib/typsescriptInterfaces";

interface UserObj {
  errors: string[];
  data: User;
}

async function getAuthUser(prisma: PrismaCtx, requestObj: any) {
  let token = "";
  let user: UserObj = { errors: [], data: {} };
  const secret = process.env.SERVER_SECRET ? process.env.SERVER_SECRET : "";
  if (secret === "") {
    // zJED PROD TODO: Switch to return errObj(ERR_01_NOT_AUTHORIZED)
    return errObj("ERROR:SERVER:prismaGetAuthUser:: Invalid server configuration. Secret missing.");
  }
  try {
    token = requestObj.req.headers.authorization.replace("Bearer ", "");
    // zJED PROD TODO: Remove console.log
    console.log("ERROR:INFO:prismaGetAuthUser:: token found");
  } catch (err) {
    // zJED PROD TODO: Switch to return errObj(ERR_01_NOT_AUTHORIZED) and remove console.logs
    console.log("ERROR:SERVER:prismaGetAuthUser:: Request missing authentication headers");
    if (requestObj.req && requestObj.req.headers) {
      console.log("ERROR:INFO:prismaGetAuthUser:: headers\n", requestObj.req.headers);
    }
    return errObj("ERROR:SERVER:prismaGetAuthUser:: Request missing authentication headers");
  }
  try {
    const decoded: any = jwt.verify(token, secret);
    // zJED PROD TODO: Remove console.log
    console.log("token decoded", decoded);
    if (
      typeof decoded === "object" &&
      typeof decoded.id === "string" &&
      decoded.id.length === PRISMA_ID_LENGTH
    ) {
      user = await prismaResponse(prisma.user, [{ id: decoded.id }]);
    } else {
      // zJED PROD TODO: Switch to return errObj(ERR_01_NOT_AUTHORIZED)
      return errObj("ERRROR:SERVER:prismaGetAuthUser:: Token invalid");
    }
    if (user.errors.length > 0) {
      // Allow prisma server errors to be returned instead of the default 'Not authorized'
      return errObj(user.errors);
    }
    const valid =
      user.data && typeof user.data.id === "string" && Array.isArray(user.data.permissions);
    if (!valid) {
      return errObj("ERRROR:SERVER:prismaGetAuthUser:: Unexpected response when authenticating.");
    }
    // Once response is confirmed, make sure user is active and doesn't have a deletedAt flag.
    if (!user.data.active) {
      return errObj(ERR_01_NOT_AUTHORIZED);
    }
    if (typeof user.data.deletedAt !== "undefined" && user.data.deletedAt !== null) {
      // zJED PROD TODO: Switch to return errObj(ERR_01_NOT_AUTHORIZED)
      return errObj("ERRROR:SERVER:prismaGetAuthUser:: User marked as deleted.");
    }
  } catch (err) {
    // zJED TODO PROD: Switch to NOT_AUTHORIZED message once testing is done
    return errObj(
      `ERROR:SERVER:prismaGetAuthUser try-catch:: ${
        err.message ? err.message : JSON.stringify(err)
      }`,
    );
    // errors.push(NOT_AUTHORIZED_ERR_OBJ);
  }
  return dataObj([], user.data);
}
export default getAuthUser;

import isEmail from "isemail";
import { PrismaCtx } from "../lib/typsescriptInterfaces";
import { errRobj, dataObjRobj } from "./responseShaperSERVER";
import responseShaperPrisma from "../util/responseShaperPRISMA";

async function isEmailTaken(prisma: PrismaCtx, email: string) {
  if (!isEmail.validate(email)) {
    return errRobj("Invalid email");
  }
  const whereObj = { where: { email_lcase: email.trim().toLowerCase() } };
  const response = await responseShaperPrisma(prisma.users, [whereObj]);
  if (Array.isArray(response.errors) && response.errors.length > 0) {
    return errRobj(response.errors);
  }
  if (Array.isArray(response.data) && response.data.length > 0) {
    return dataObjRobj([], { taken: true });
  }
  return dataObjRobj([], { taken: false });
}

export default isEmailTaken;

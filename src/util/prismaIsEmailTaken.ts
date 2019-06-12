import isEmail from "isemail";
import { PrismaCtx } from "../lib/typsescriptInterfaces";
import { errObj } from "./responseShaperSERVER";

async function isEmailTaken(prisma: PrismaCtx, email: string) {
  if (!isEmail.validate(email)) {
    return errObj("Invalid email");
  }
  const whereObj = { where: { email_lcase: email.trim().toLowerCase() } };
  const prismaResponseObj = await prisma.users(whereObj);
  if (prismaResponseObj.length > 0) {
    return errObj("Email taken.");
  }
  return errObj();
}

export default isEmailTaken;

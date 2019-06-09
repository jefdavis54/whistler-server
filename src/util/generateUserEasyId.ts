import { PrismaCtx } from "../lib/typsescriptInterfaces";
import { errObj } from "./responseShaperSERVER";

const generateUserEasyId = async (prisma: PrismaCtx, name: string) => {
  const prismaResponseObj = await prisma.users();
  if (prismaResponseObj.length === 0) {
    return errObj("Email taken.");
  }
  return errObj();
};

export default generateUserEasyId;

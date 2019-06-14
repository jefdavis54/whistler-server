import { PrismaCtx } from "../lib/typsescriptInterfaces";
import { errRobj } from "./responseShaperSERVER";

const generateUserEasyId = async (prisma: PrismaCtx, name: string) => {
  const prismaResponseObj = await prisma.users();
  if (prismaResponseObj.length === 0) {
    return errRobj("Email taken.");
  }
  return errRobj();
};

export default generateUserEasyId;

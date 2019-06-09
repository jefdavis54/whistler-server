import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from "../../lib/typsescriptInterfaces";

const users = async (parent: any, { withName = "" }, { prisma }: Context) => {
  const withName_lcase = withName.trim().toLowerCase();
  let where: any = undefined;
  if (withName_lcase.length > 0) {
    where = { name_lcase_contains: withName_lcase.toLowerCase() };
  }
  const response = await prismaResponse(prisma.users, [where]);
  if (Array.isArray(response.data) && response.data.length > 0) {
    response.data = response.data.map(user => {
      if (user.password) {
        delete user.password;
      }
      return user;
    });
  }
  return response;
};

export default users;

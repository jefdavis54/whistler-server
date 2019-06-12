import prismaResponse from "../../util/responseShaperPRISMA";
import { Context, User } from "../../lib/typsescriptInterfaces";
import { PERMISSIONS_OBJ, PRISMA_ID_LENGTH } from "../../lib/constants";
import { errObj } from "../../util/responseShaperSERVER";
import getAuthUserIdWithPermission from "../../util/prismaGetAuthUserIdWithPermission";

interface Where {
  name_lcase_contains: string;
}

const users = async (parent: any, { withName = "" }, { prisma, request }: Context) => {
  const checkId = await getAuthUserIdWithPermission(prisma, request, [PERMISSIONS_OBJ.ADMIN]);
  if (checkId.errors.length > 0) {
    return errObj(checkId.errors);
  }
  if (
    checkId.data &&
    typeof checkId.data === "string" &&
    checkId.data.length === PRISMA_ID_LENGTH
  ) {
    const withName_lcase = withName.trim().toLowerCase();
    let where: Where | undefined = undefined;
    if (withName_lcase.length > 0) {
      where = { name_lcase_contains: withName_lcase.toLowerCase() };
    }
    const response = await prismaResponse(prisma.users, [where]);
    if (Array.isArray(response.data) && response.data.length > 0) {
      response.data = response.data.map((user: User) => {
        if (user.password) {
          delete user.password;
        }
        return user;
      });
    }
    console.log(response);
    return response;
  }
  return errObj("ERROR:SERVER:Query:users:: Unknown error attempting to retrieve users.");
};

export default users;

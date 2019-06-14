import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from "../../lib/typsescriptInterfaces";
import getAuthUserIdWithPermission from "../../util/prismaGetAuthUserIdWithPermission";
import { PERMISSIONS_OBJ, PRISMA_ID_LENGTH } from "../../lib/constants";
import { errRobj } from "../../util/responseShaperSERVER";

const artworks = async (parent: any, args: any, { prisma, request }: Context) => {
  const checkId = await getAuthUserIdWithPermission(prisma, request, [PERMISSIONS_OBJ.USER]);
  if (checkId.errors.length > 0) {
    return errRobj(checkId.errors);
  }
  if (
    checkId.data &&
    typeof checkId.data === "string" &&
    checkId.data.length === PRISMA_ID_LENGTH
  ) {
    return prismaResponse(prisma.artworks);
  }
  return errRobj("ERROR:SERVER:Query:artworks:: Unknown error attempting to retrieve artworks.");
};

export default artworks;

import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from "../../lib/typsescriptInterfaces";
import getAuthUserIdWithPermission from "../../util/prismaGetAuthUserIdWithPermission";
import { PERMISSIONS_OBJ, PRISMA_ID_LENGTH } from "../../lib/constants";
import { errObj } from "../../util/responseShaperSERVER";

const artworkLocations = async (parent: any, args: any, { prisma, request }: Context) => {
  const checkId = await getAuthUserIdWithPermission(prisma, request, [PERMISSIONS_OBJ.USER]);
  if (checkId.errors.length > 0) {
    return errObj(checkId.errors);
  }
  if (
    checkId.data &&
    typeof checkId.data === "string" &&
    checkId.data.length === PRISMA_ID_LENGTH
  ) {
    return prismaResponse(prisma.artworkLocations);
  }
  return errObj(
    "ERROR:SERVER:Query:artworkLocations:: Unknown error attempting to retrieve artworkLocations.",
  );
};

export default artworkLocations;

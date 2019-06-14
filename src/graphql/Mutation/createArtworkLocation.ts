import { Context, ArtworkLocation } from "../../lib/typsescriptInterfaces";
import prismaResponse from "../../util/responseShaperPRISMA";
import { errRobj } from "../../util/responseShaperSERVER";
import getAuthUserIdWithPermission from "../../util/prismaGetAuthUserIdWithPermission";
import { PERMISSIONS_OBJ } from "../../lib/constants";
import { ERR_01_NOT_AUTHORIZED } from "../../lib/errorMessages";

interface Props {
  data: ArtworkLocation;
}

const createArtworkLocation = async (
  parent: any,
  { data: dataToChk }: Props,
  { prisma, request }: Context,
) => {
  const userId = await getAuthUserIdWithPermission(prisma, request, [PERMISSIONS_OBJ.USER]);
  if (userId.errors.length > 0) {
    return errRobj(ERR_01_NOT_AUTHORIZED);
  }
  if (dataToChk.easyId) {
    const whereObj = { where: { easyId: dataToChk.easyId.toLowerCase() } };
    const prismaResponseObj = await prismaResponse(prisma.artworkLocations, [whereObj]);
    if (prismaResponseObj.errors.length > 0) {
      return errRobj(prismaResponseObj.errors);
    }
    if (prismaResponseObj.data.length > 0) {
      return errRobj("EasyId taken.");
    }
  } else {
    return errRobj("EasyId is missing.");
  }
  // zJED TODO data validation of dataToChk
  const data = { ...dataToChk };
  data.owner = { connect: { id: userId.data } };
  return prismaResponse(prisma.createArtworkLocation, [data]);
};

export default createArtworkLocation;

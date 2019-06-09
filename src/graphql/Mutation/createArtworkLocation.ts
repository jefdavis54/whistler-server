import { Context, ArtworkLocation } from "../../lib/typsescriptInterfaces";
import prismaResponse from "../../util/responseShaperPRISMA";
import { errObj } from "../../util/responseShaperSERVER";

interface Props {
  data: ArtworkLocation;
}

const createArtworkLocation = async (
  parent: any,
  { data: dataToChk }: Props,
  { prisma }: Context,
) => {
  if (dataToChk.easyId) {
    const whereObj = { where: { easyId: dataToChk.easyId.toLowerCase() } };
    const prismaResponseObj = await prismaResponse(prisma.artworkLocations, [whereObj]);
    if (prismaResponseObj.errors.length > 0) {
      return errObj(prismaResponseObj.errors);
    }
    if (prismaResponseObj.data.length > 0) {
      return errObj("EasyId taken.");
    }
  } else {
    return errObj("EasyId is missing.");
  }
  // zJED TODO Owner should come from request context. Right now I just default it to admin
  const data = { ...dataToChk };
  data.owner = { connect: { email_lcase: process.env.ADMIN_EMAIL_LCASE } };
  return prismaResponse(prisma.createArtworkLocation, [data]);
};

export default createArtworkLocation;

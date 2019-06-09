import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from '../../lib/typsescriptInterfaces'

const artworkLocations = (parent: any, args: any, { prisma }: Context) => {
  return prismaResponse(prisma.artworkLocations)
}

export default artworkLocations

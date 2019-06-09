import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from '../../lib/typsescriptInterfaces'

const artworks = (parent: any, args: any, { prisma }: Context) => {
  return prismaResponse(prisma.artworks)
}

export default artworks

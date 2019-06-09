import prismaResponse from "../../util/responseShaperPRISMA";
import { Context } from '../../lib/typsescriptInterfaces'

const artists = (parent: any, args: any, { prisma }: Context) => {
  return prismaResponse(prisma.artists)
}

export default artists

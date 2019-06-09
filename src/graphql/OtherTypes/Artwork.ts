import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const ArtworkResolvers = {
  owner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artwork({ id }).owner();
  },
  artist({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artwork({ id }).artist();
  },
  artworkLocation({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artwork({ id }).artworkLocation();
  },
  auctions({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artwork({ id }).auctions();
  },
};
export default ArtworkResolvers;

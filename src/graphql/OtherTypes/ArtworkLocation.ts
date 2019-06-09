import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const ArtworkLocationResolvers = {
  owner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artworkLocation({ id }).owner();
  },
  artworks({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artworkLocation({ id }).artworks();
  },
  artists({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artworkLocation({ id }).artists();
  },
};
export default ArtworkLocationResolvers;

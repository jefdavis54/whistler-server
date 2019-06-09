import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const ArtistResolvers = {
  owner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artist({ id }).owner();
  },
  artworks({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artist({ id }).artworks();
  },
  artworkLocations({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.artist({ id }).artworkLocations();
  },
};
export default ArtistResolvers;

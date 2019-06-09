import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const AuctionArtwork = {
  seller({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtwork({ id }).seller();
  },
  buyer({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtwork({ id }).buyer();
  },
  artwork({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtwork({ id }).artwork();
  },
  bids({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtwork({ id }).bids();
  },
  watchers({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtwork({ id }).watchers();
  },
};
export default AuctionArtwork;

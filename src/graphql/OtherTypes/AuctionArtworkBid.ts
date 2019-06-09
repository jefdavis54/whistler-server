import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const AuctionArtworkBid = {
  auction({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtworkBid({ id }).auction();
  },
  bidder({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.auctionArtworkBid({ id }).bidder();
  },
};
export default AuctionArtworkBid;

import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const UserResolvers = {
  postsOwner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.user({ id }).posts();
  },
  commentsOwner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.user({ id }).comments();
  },
  artistRecords({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.user({ id }).artistRecords();
  },
  artworkRecords({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.user({ id }).artworkRecords();
  },
  artworkLocationRecords({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.user({ id }).artworkLocationRecords();
  },
};
export default UserResolvers;

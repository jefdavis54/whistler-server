import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const PostResolver = {
  owner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.post({ id }).owner();
  },
  comments({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.post({ id }).comments();
  },
};
export default PostResolver;

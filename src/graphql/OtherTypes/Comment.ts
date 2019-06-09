import { Context, IdObj } from '../../lib/typsescriptInterfaces'

// default arguments for resolvers => resolverRype: { function(parent, args, ctx, info) {} }
const CommentResolvers = {
  owner({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.comment({ id }).owner();
  },
  post({ id }: IdObj, args: any, { prisma }: Context) {
    return prisma.comment({ id }).post();
  },
};
export default CommentResolvers;

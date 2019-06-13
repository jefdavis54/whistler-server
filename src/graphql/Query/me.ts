import { Context } from "../../lib/typsescriptInterfaces";
import { errObj, dataObj } from "../../util/responseShaperSERVER";
import getAuthUser from "../../util/prismaGetAuthUser";

const me = async (parent: any, args: any, { prisma, request }: Context) => {
  const user = await getAuthUser(prisma, request);
  if (user.errors.length > 0) {
    return errObj(user.errors);
  }
  const me = {
    name: user.data.name,
    email: user.data.email,
  };
  return dataObj([], me);
};

export default me;

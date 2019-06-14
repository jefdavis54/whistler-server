import { Context } from "../../lib/typsescriptInterfaces";
import { errRobj, dataObjRobj } from "../../util/responseShaperSERVER";
import getAuthUser from "../../util/prismaGetAuthUser";

const me = async (parent: any, args: any, { prisma, request }: Context) => {
  const user = await getAuthUser(prisma, request);
  if (user.errors.length > 0) {
    return errRobj(user.errors);
  }
  const me = {
    easyId: user.data.easyId,
    name: user.data.name,
    email: user.data.email,
  };
  return dataObjRobj([], me);
};

export default me;

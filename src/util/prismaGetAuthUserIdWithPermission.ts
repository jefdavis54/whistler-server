import getAuthUser from "./prismaGetAuthUser";
import { errObj, dataStr } from "./responseShaperSERVER";
import { ERR_01_NOT_AUTHORIZED } from "../lib/errorMessages";
import { PrismaCtx } from "../lib/typsescriptInterfaces";

async function getAuthUserIdWithPermission(
  prisma: PrismaCtx,
  requestObj: any,
  permissionsNeededArr: string[],
) {
  const user = await getAuthUser(prisma, requestObj);
  if (user.errors.length > 0) {
    return errObj(user.errors);
  }
  if (!Array.isArray(permissionsNeededArr)) {
    return errObj("ERROR:SERVER:getAuthUserIdWithPermission::Invalid permissions array");
  }
  const hasAllPermissions = permissionsNeededArr.every(permissionNeeded =>
    user.data.permissions.includes(permissionNeeded),
  );
  if (!hasAllPermissions) {
    return errObj(ERR_01_NOT_AUTHORIZED);
  }
  return dataStr([], user.data.id);
}
export default getAuthUserIdWithPermission;

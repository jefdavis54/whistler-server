import getAuthUser from "./prismaGetAuthUser";
import { errRobj, dataStrRobj } from "./responseShaperSERVER";
import { ERR_01_NOT_AUTHORIZED } from "../lib/errorMessages";
import { PrismaCtx } from "../lib/typsescriptInterfaces";

async function getAuthUserIdWithPermission(
  prisma: PrismaCtx,
  requestObj: any,
  permissionsNeededArr: string[],
) {
  const user = await getAuthUser(prisma, requestObj);
  if (user.errors.length > 0) {
    return errRobj(user.errors);
  }
  if (!Array.isArray(permissionsNeededArr)) {
    return errRobj("ERROR:SERVER:getAuthUserIdWithPermission::Invalid permissions array");
  }
  const hasAllPermissions = permissionsNeededArr.every(permissionNeeded =>
    user.data.permissions.includes(permissionNeeded),
  );
  if (!hasAllPermissions) {
    return errRobj(ERR_01_NOT_AUTHORIZED);
  }
  return dataStrRobj([], user.data.id);
}
export default getAuthUserIdWithPermission;

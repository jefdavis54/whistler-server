import { Context, DataPasswordReset } from "../../lib/typsescriptInterfaces";
import responseShaper from "../../util/responseShaperPRISMA";
import { errRobj, dataObjRobj } from "../../util/responseShaperSERVER";
import generatePasswordHash from "../../util/generatePasswordHash";
import generateToken from "../../util/generateTokenForUser";

const resetPassword = async (parent: any, { data }: DataPasswordReset, { prisma }: Context) => {
  const where = { email_lcase: data.email.trim().toLowerCase() };
  const userRobj = await responseShaper(prisma.user, [where]);
  if (userRobj.errors.length > 0) {
    return errRobj(userRobj.errors);
  }
  if (
    !userRobj.data ||
    typeof userRobj.data.resetToken !== "string" ||
    userRobj.data.resetToken.length === 0
  ) {
    return errRobj(
      "Password not pending reset or server not available. Reinitiate password reset process and try again.",
    );
  }
  const resetTokenExpiry = parseInt(userRobj.data.resetTokenExpiry);
  if (Number.isNaN(resetTokenExpiry)) {
    return errRobj("Invalid Token Expiry. Reinitiate password reset process and try again.");
  }
  if (Date.now() > resetTokenExpiry) {
    return errRobj("Token has expired. Reinitiate password reset process and try again.");
  }
  if (data.resetToken.trim() === userRobj.data.resetToken) {
    const passwordHashRobj = generatePasswordHash(data.password);
    if (passwordHashRobj.errors.length > 0) {
      return errRobj(passwordHashRobj.errors);
    }
    const updateObj = {
      where,
      data: {
        password: passwordHashRobj.data,
        resetToken: "",
        resetTokenExpiry: "",
      },
    };
    const updateUserRobj = await responseShaper(prisma.updateUser, [updateObj]);
    if (updateUserRobj.errors.length > 0) {
      return errRobj(updateUserRobj.errors);
    }
    const tokenRobj = generateToken(updateUserRobj.data);
    if (tokenRobj.errors.length > 0) {
      return errRobj(tokenRobj.errors);
    }
    return dataObjRobj([], updateUserRobj.data, tokenRobj.data);
  }
  return errRobj("Invalid password reset token.");
};

export default resetPassword;

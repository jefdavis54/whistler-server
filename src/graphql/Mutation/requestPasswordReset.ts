import { Context, DataRequestPasswordReset } from "../../lib/typsescriptInterfaces";
import prismaResponse from "../../util/responseShaperPRISMA";
import { errRobj, dataStrRobj } from "../../util/responseShaperSERVER";
import { randomBytes } from "crypto";
import { promisify } from "util";
import sendAdminEmail from "../../util/sendAdminEmail";

// zJED Add a promise to this that will only update the resetTokenExpiry
const requestPasswordReset = async (
  parent: any,
  { email }: DataRequestPasswordReset,
  { prisma }: Context,
) => {
  // zJED TODO PROD: Remove console.log
  console.log("requestPasswordReset", email);
  const where = { email: email.toLowerCase().trim() };
  const userRobj = await prismaResponse(prisma.user, [where]);
  if (userRobj.errors.length > 0) {
    return errRobj(userRobj.errors);
  } else if (userRobj.data && !userRobj.data.taken) {
    return errRobj("Account not found.");
  }
  // zJED TODO: Only create a new reset token after 5 minutes has elapsed from the last attempt.
  const randomBytesPromisified = promisify(randomBytes);
  const resetToken = (await randomBytesPromisified(20)).toString("hex");
  const resetTokenExpiry = Date.now() + 1000 * 60 * 60;
  const data = { resetToken, resetTokenExpiry };
  const response = await prismaResponse(prisma.updateUser, [{ where, data }]);
  if (response.errors.length > 0) {
    return errRobj(response.errors);
  }
  const emailSent = await sendAdminEmail(
    "Password Reset Requester",
    email.trim(),
    `Password Reset Request token:\n${resetToken}\n`,
  );
  // zJED TODO PROD: Remove these console.log
  console.log("Email sent");
  console.log(emailSent);
  return dataStrRobj([], "Reset password email sent.");
};

export default requestPasswordReset;

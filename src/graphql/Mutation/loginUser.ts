import bcrypt from "bcryptjs";
import isEmail from "isemail";
import prismaResponse from "../../util/responseShaperPRISMA";
import generateTokenForUser from "../../util/generateTokenForUser";
import { errObj, dataObj } from "../../util/responseShaperSERVER";
import { Context, DataLoginUser } from "../../lib/typsescriptInterfaces";

const loginUser = async (parent: any, { data: dataToChk }: DataLoginUser, { prisma }: Context) => {
  const { email, password } = dataToChk;
  if (!isEmail.validate(email)) {
    return errObj(`Invalid email provided: ${email}`);
  }

  const whereObj = { where: { email_lcase: email.trim().toLowerCase() } };
  const prismaUsersResponseObj = await prismaResponse(prisma.users, [whereObj]);
  if (prismaUsersResponseObj.data.length === 0) {
    return errObj("User not found.");
  }
  if (prismaUsersResponseObj.data.length > 1) {
    return errObj("ERROR:SERVER:resolvers:mutation:loginUser:: Unexpected Prisma Response Shape.");
  }

  const [user] = prismaUsersResponseObj.data;
  if (!user.active) {
    return errObj("Account disabled. Please contact administrator.");
  }

  let token = "";
  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      token = generateTokenForUser(user);
    } else {
      return errObj("Password incorrect.");
    }
  } catch (err) {
    return errObj("Unknown error attempting to validate password.");
  }
  delete user.password;

  return dataObj([], user, token);
};
export default loginUser;

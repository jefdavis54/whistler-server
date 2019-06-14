import bcrypt from "bcryptjs";
import isEmail from "isemail";
import prismaResponse from "../../util/responseShaperPRISMA";
import generateTokenForUser from "../../util/generateTokenForUser";
import { errRobj, dataObjRobj } from "../../util/responseShaperSERVER";
import { Context, DataLoginUser } from "../../lib/typsescriptInterfaces";

const loginUser = async (parent: any, { data: dataToChk }: DataLoginUser, { prisma }: Context) => {
  const { email, password } = dataToChk;
  if (!isEmail.validate(email)) {
    return errRobj(`Invalid email provided: ${email}`);
  }

  const whereObj = { where: { email_lcase: email.trim().toLowerCase() } };
  const prismaUsersResponseObj = await prismaResponse(prisma.users, [whereObj]);
  if (prismaUsersResponseObj.data.length === 0) {
    return errRobj("User not found.");
  }
  if (prismaUsersResponseObj.data.length > 1) {
    return errRobj("ERROR:SERVER:resolvers:mutation:loginUser:: Unexpected Prisma Response Shape.");
  }

  const [user] = prismaUsersResponseObj.data;
  if (!user.active) {
    return errRobj("Account disabled. Please contact administrator.");
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const tokenRobj = generateTokenForUser(user);
      if (tokenRobj.errors.length > 0) {
        return errRobj(tokenRobj.errors);
      }
      delete user.password;
      return dataObjRobj([], user, tokenRobj.data);
    } else {
      return errRobj("Password incorrect.");
    }
  } catch (err) {
    return errRobj("Unknown error attempting to validate password.");
  }
};
export default loginUser;

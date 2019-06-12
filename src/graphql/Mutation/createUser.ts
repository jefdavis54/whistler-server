import { Context, DataCreateUser, User } from "../../lib/typsescriptInterfaces";
import prismaResponse from "../../util/responseShaperPRISMA";
import { errObj, dataObj } from "../../util/responseShaperSERVER";
import isEmailTaken from "../../util/prismaIsEmailTaken";
import generateTokenForUser from "../../util/generateTokenForUser";
import generatePasswordHash from "../../util/generatePasswordHash";
import { PERMISSIONS_OBJ } from "../../lib/constants";

const createUser = async (
  parent: any,
  { data: dataToChk }: DataCreateUser,
  { prisma }: Context,
) => {
  // SEC01 VALIDATE REQUESTER RIGHTS: Not Required
  // SEC02 VALIDATE INPUTS
  const errors = [];
  const data: User = {
    easyId: "",
    name: "",
    name_lcase: "",
    email: "",
    email_lcase: "",
    password: "",
  };
  const name = dataToChk.name.trim();
  if (name.length > 0) {
    data.name = name;
    data.name_lcase = name.toLowerCase();
  } else {
    errors.push("Invalid name.");
  }
  const email = dataToChk.email.trim();
  const emailTakenObj = await isEmailTaken(prisma, dataToChk.email);
  if (emailTakenObj.errors.length > 0) {
    errors.push(...emailTakenObj.errors);
  } else {
    data.email = email;
    data.email_lcase = email.toLowerCase();
  }
  // Do not trim or modify dataToChk.password. The generatePasswordHash function is responsible for handling that if needed.
  const hashedPasswordObj = await generatePasswordHash(dataToChk.password);
  if (hashedPasswordObj.errors.length === 0) {
    data.password = hashedPasswordObj.data;
  } else {
    errors.push(...hashedPasswordObj.errors);
  }
  if (errors.length > 0) {
    return errObj(errors);
  }
  const { USER } = PERMISSIONS_OBJ;
  // emailValidated: false,
  // active: true,
  const createUserObj = {
    ...data,
    permissions: {
      set: USER,
    },
  };
  // SEC03 WRITE TO PRISMA DATABASE
  const user = await prismaResponse(prisma.createUser, [createUserObj]);
  if (user.errors.length === 0 && user.data) {
    delete user.data.password;
    const { id } = user.data;
    if (typeof id !== "string") {
      return errObj("Create user failed.");
    }
    const token = generateTokenForUser(user.data);
    return dataObj([], user.data, token);
  }
  return errObj(user.errors);
};

export default createUser;

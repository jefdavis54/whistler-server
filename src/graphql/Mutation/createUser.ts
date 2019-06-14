import { Context, DataCreateUser, User } from "../../lib/typsescriptInterfaces";
import prismaResponse from "../../util/responseShaperPRISMA";
import { errRobj, dataObjRobj } from "../../util/responseShaperSERVER";
import isEmailTaken from "../../util/prismaIsEmailTaken";
import generateTokenForUser from "../../util/generateTokenForUser";
import generatePasswordHash from "../../util/generatePasswordHash";
import { PERMISSIONS_OBJ } from "../../lib/constants";

// zJED TODO: It would be nice to attempt to login with the new user credentials
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
  } else if (emailTakenObj.data) {
    if (emailTakenObj.data.taken) {
      errors.push("Email taken");
    } else {
      data.email = email;
      data.email_lcase = email.toLowerCase();
    }
  } else {
    errors.push("Unexpected response attempting to check if email already exists");
  }
  // Do not trim or modify dataToChk.password. The generatePasswordHash function is responsible for handling that if needed.
  const hashedPasswordObj = await generatePasswordHash(dataToChk.password);
  if (hashedPasswordObj.errors.length === 0) {
    data.password = hashedPasswordObj.data;
  } else {
    errors.push(...hashedPasswordObj.errors);
  }
  if (errors.length > 0) {
    return errRobj(errors);
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
      return errRobj("Create user failed.");
    }
    const tokenRobj = generateTokenForUser(user.data);
    if (tokenRobj.errors.length > 0) {
      return errRobj(tokenRobj.errors);
    }
    return dataObjRobj([], user.data, tokenRobj.data);
  }
  return errRobj(user.errors);
};

export default createUser;

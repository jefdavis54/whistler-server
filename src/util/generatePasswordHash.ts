import bcrypt from "bcryptjs";
import { errRobj, dataStrRobj } from "./responseShaperSERVER";
import validatePassword from "../shared/validatePassword";

// zJED TODO: Add a server 'pepper' to password before hashing. Mostly because bcrypt has a weird max length limitation and a pepper would consistently get around that.

// This performs password validation and returns the hash value as the data object
const generatePasswordHash = (password: string) => {
  const passwordErrArr = validatePassword(password);
  if (passwordErrArr.length > 0) {
    return errRobj(passwordErrArr);
  }
  const hash = bcrypt.hashSync(password, 15);
  return dataStrRobj([], hash);
};

export default generatePasswordHash;

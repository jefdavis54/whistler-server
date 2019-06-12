import bcrypt from "bcryptjs";
import { errObj, dataStr } from "./responseShaperSERVER";

// zJED TODO: Add a server 'pepper' to password before hashing. Mostly because bcrypt has a weird max length limitation and a pepper would consistently get around that.

// This performs password validation and returns the hash value as the data object
const generatePasswordHash = (password: string) => {
  const errors = [];
  const trimmedPassword = password.trim();
  if (password.length !== trimmedPassword.length) {
    errors.push("Password cannot contain leading or trailing spaces.");
  }
  // Password requires at least 1 lower case character, 1 upper case character, and allows other characters
  // zJED TODO: Implement this with VerbalExpression instead of regex.
  const regex = /(?!.*(.)\1\1\1)((?=.*[\d\W_A-Z])(?=.*[a-z])(?=.*[A-Z]).{8,60})/;
  const regexTest = regex.exec(password);
  if (regexTest === null) {
    if (password.length < 8 || password.length > 60) {
      errors.push("Password must be 8-60 characters in length.");
    }
    if (password.toUpperCase() === password || password.toLowerCase() === password) {
      errors.push("Password must contain both upper and lower case characters.");
    }
    const regexRepTest = /(.)\1\1\1/;
    if (regexRepTest.exec(password)) {
      errors.push("Password cannot repeat the same character more than 3 times.");
    }
  }
  if (errors.length > 0) {
    return errObj(errors);
  }
  if (Array.isArray(regexTest) && regexTest[0] === password) {
    const hash = bcrypt.hashSync(password, 15);
    return dataStr([], hash);
  }
  return errObj("Invalid password.");
};

export default generatePasswordHash;

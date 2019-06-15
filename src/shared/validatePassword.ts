// zJED This library should be identical to one on the frontend and backend so that both perform the same validation.

const validatePassword = (password: string) => {
  const errors = [];
  const trimmedPassword = password.trim();
  if (password.length !== trimmedPassword.length) {
    errors.push("Password cannot contain leading or trailing whitespace.");
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

  return errors;
};

export default validatePassword;

// zJED TODO: The validation done by this helper function should be done with test cases eventually.

interface ReturnObject {
  errors: string[];
  data: any;
  token: string | undefined;
}

const validateErrors = (errors: string | string[]): ReturnObject => {
  const returnObj: ReturnObject = {
    errors: [],
    data: undefined,
    token: undefined,
  };

  let trimmedString = "";
  if (typeof errors === "string") {
    trimmedString = errors.trim();
    if (trimmedString.length > 0) {
      returnObj.errors = [trimmedString];
    }
  } else if (Array.isArray(errors)) {
    if (errors.every(error => typeof error === "string")) {
      returnObj.errors = errors.map(error => error.trim());
    }
  } else {
    returnObj.errors = ["ERROR:SERVER:validateErrors: Malformed Error Array Received"];
  }
  return returnObj;
};

const dataGenericCheck = (
  errors: string | string[],
  data: object | string | [] | undefined,
  token: string | undefined,
  datatype: object | string | [],
): ReturnObject => {
  let valid = true;
  const validatedErrorObj = validateErrors(errors);
  const responseObj: ReturnObject = {
    errors: validatedErrorObj.errors,
    data: undefined,
    token: undefined,
  };
  if (typeof data === typeof datatype) {
    responseObj.data = data;
  } else if (typeof data === "undefined") {
    responseObj.data = datatype;
  } else {
    valid = false;
    // zJED TODO PROD: Change this to something more generic for production
    responseObj.errors.push(
      `ERROR:SERVER:dataGenericCheck:: Invalid prisma data response received. Expected typeof:${typeof datatype} => Received typeof:${typeof data} for ${JSON.stringify(
        data,
      )}`,
    );
  }
  if (typeof token === "string") {
    responseObj.token = token;
  } else if (typeof token !== "undefined") {
    valid = false;
    responseObj.errors.push("ERROR:SERVER:dataGenericCheck:: Invalid token received.");
  }
  if (valid) {
    return responseObj;
  }
  return { errors: responseObj.errors, data: undefined, token: undefined };
};

const errRobj = (errors: string | string[] = []): ReturnObject => validateErrors(errors);
const dataObjRobj = (errors: string[], data: any, token = ""): ReturnObject =>
  dataGenericCheck(errors, data, token, {});
const dataArrRobj = (errors: string[], data: [], token = ""): ReturnObject =>
  dataGenericCheck(errors, data, token, []);
const dataStrRobj = (errors: string[], data: string, token = ""): ReturnObject =>
  dataGenericCheck(errors, data, token, "");

export { errRobj, dataArrRobj, dataObjRobj, dataStrRobj };

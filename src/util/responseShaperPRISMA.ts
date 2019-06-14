import { errRobj } from "./responseShaperSERVER";
import { ERR_03_NO_DELETEDAT_FLAG } from "../lib/errorMessages";
import { PrismaResponse } from "../lib/typsescriptInterfaces";
// zJED: My convention is to have this provide a consistent return object to all prisma Query & Mutation requests.
// zJED: This should make it easier, for example, to remove records from all mutation prisma responses with a deletedAt flag set to something other than null
// zJED: May also help if I want to append a caller to the errors returned in the future.
// zJED: It also allows for more consistent processing and summarizing of Prisma Errors vs Server Errors

type PrismaParam = any[];

async function prismaResponseShaper(
  prismaFn: any,
  prismaPar: PrismaParam = [],
  includeDeletedRecords = false,
) {
  // zJED TODO: Add a string length checker.
  const returnObject: PrismaResponse = { errors: [], data: { deletedAt: undefined } };
  try {
    const prismaResults = await prismaFn(...prismaPar);
    if (Array.isArray(prismaResults.errors)) {
      return errRobj(prismaResults.errors);
    }
    if (!includeDeletedRecords) {
      if (Array.isArray(prismaResults)) {
        returnObject.data = prismaResults.reduce((accumulator, item) => {
          if (typeof item.deletedAt === "undefined") {
            // Try and catch any prisma requests that could expose or summarize data with deletedAt records included.
            throw new Error(ERR_03_NO_DELETEDAT_FLAG);
          }
          if (item.deletedAt === null) {
            delete item.deletedAt;
            accumulator.push(item);
          }
          return accumulator;
        }, []);
      } else if (prismaResults.deletedAt === null) {
        returnObject.data = prismaResults;
        delete returnObject.data.deletedAt;
      } else if (typeof prismaResults.deletedAt === "undefined") {
        // Try and catch any prisma requests that could expose or summarize data with deletedAt records included.
        throw new Error(ERR_03_NO_DELETEDAT_FLAG);
      }
    } else {
      returnObject.data = prismaResults;
    }
    return returnObject;
  } catch (err) {
    // zJED TODO PROD: These messages may want to switch to NOT AUTHORIZED since they expose the inner working of the parent prisma database.
    // console.log("prismaResponseShaper:catch block::\n", err);
    // console.log("prismaResponseShaper:catch block:message::\n", err.message);
    const msg = err.message ? err.message : JSON.stringify(err);
    returnObject.errors.push(`ERROR:PRISMA:responseShaperPrisma try-catch::${msg}`);
    return returnObject;
  }
}

export default prismaResponseShaper;

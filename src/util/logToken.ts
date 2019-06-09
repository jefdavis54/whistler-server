import jwt from "jsonwebtoken";
import generatePasswordHash from "./generatePasswordHash";

async function logToken(hashPassword: string = "") {
  if (Number(process.env.PORT) === NaN) {
    throw new Error("Invalid Environmental Variables");
  }

  // zJED TODO PROD: Remove this playground token generator and associated console.log
  // {"Authorization": "Bearer __token_here__"}
  const secret = process.env.PRISMA_SECRET ? process.env.PRISMA_SECRET : "";
  const service = process.env.PRISMA_SERVICE ? process.env.PRISMA_SERVICE : "default@default";
  if (secret !== "") {
    const playgroundToken = jwt.sign(
      {
        data: { service },
      },
      secret,
      {
        expiresIn: "7d",
      },
    );

    console.log("playgroundToken\n", playgroundToken);
  }

  if (hashPassword.length > 0) {
    try {
      const hash = await generatePasswordHash(hashPassword);
      console.log("hash\n", hash);
    } catch (err) {
      console.log("generatePasswordHash ERROR:\n", err);
    }
  }
}

logToken();

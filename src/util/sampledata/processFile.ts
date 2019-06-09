import fs from "fs";
import processRow from "./processRow";
import clearTable from "./clearTable";
import { prisma } from "../../generated/prisma-client";

const processFile = async (fileName: string) => {
  const supportedCategories = [
    "ARTWORK",
    "ARTWORKLOCATION",
    "ARTIST",
    "COMMENT",
    "POST",
    "USER",
    "AUCTIONARTWORK",
    "AUCTIONARTWORKBID",
  ];
  // Perform actions synchronously using for..of insteal of .forEach
  for (const cat of supportedCategories) {
    await clearTable(cat, prisma);
  }

  let category = "";
  let currentKeysARR: string[] = [];
  let currentTypesARR: string[] = [];
  let currentIsRequiredARR: boolean[] = [];
  let noArrayCheck = false;
  let nextStep = "";
  let count = 0;

  const allLines = fs.readFileSync(fileName, "ucs2");
  // Note: Some fields may contain multiline text using just newline.
  const linesARR = allLines.split(/\r\n/);
  // linesARR = linesARR.slice(0, 16);

  // Perform actions synchronously using for..of insteal of .forEach
  for (const line of linesARR) {
    const trimmedLine = line.trim();
    if (trimmedLine.length > 0) {
      const newCategory = line
        .trim()
        .toUpperCase()
        .startsWith("#START:");
      if (newCategory) {
        nextStep = "newCategory";
      }
      switch (nextStep) {
        case "newCategory":
          category = line
            .trim()
            .toUpperCase()
            .slice(7)
            .trim();
          if (!supportedCategories.includes(category)) {
            throw new Error(`Input file contains invalid category:${category}`);
          }
          nextStep = "newHeaderKeys";
          break;
        case "newHeaderKeys":
          currentKeysARR = trimmedLine.split(/\t/);
          currentKeysARR = currentKeysARR.map((key: string) => key.trim());
          nextStep = "newHeaderTypes";
          break;
        case "newHeaderTypes":
          currentTypesARR = trimmedLine.split(/\t/);
          currentTypesARR = currentTypesARR.map((type: string) => type.trim());
          currentIsRequiredARR = currentTypesARR.map((type: string) => type.endsWith("!"));
          currentTypesARR = currentTypesARR.map((type: string) => type.replace("!", ""));
          noArrayCheck = currentTypesARR.every((type: string) => !type.startsWith("["));
          if (!noArrayCheck) {
            throw new Error("Input file contains schema with unsupported Arrays.");
          }
          nextStep = "";
          break;
        default:
          await processRow(
            line,
            category,
            currentKeysARR,
            currentTypesARR,
            currentIsRequiredARR,
            prisma,
          );
      }
    }
    count += 1;
    console.log(`Line processed:${count.toString().padStart(4, " ")}`);
    // console.log("category\n", category);
    // console.log("currentKeysARR\n", currentKeysARR);
    // console.log("currentTypesARR\n", currentTypesARR);
    // console.log("currentIsRequiredARR\n", currentIsRequiredARR);
    // console.log("jed\n", jed);
  }
  return true;
};

export default processFile;

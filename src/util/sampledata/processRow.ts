import bcrypt from "bcryptjs";
import { PrismaCtx } from '../../lib/typsescriptInterfaces'

const processRow = async (
  line: string,
  category: string,
  currentKeysARR: string[],
  currentTypesARR: string[],
  currentIsRequiredARR: boolean[],
  prisma: PrismaCtx
) => {
  const supportedCategories = ["ARTWORK", "ARTWORKLOCATION", "ARTIST", "COMMENT", "POST", "USER"];
  if (!supportedCategories.includes(category.toUpperCase())) {
    throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Category:${category}`);
  }
  let lineFieldsARR = line.split(/\t/);
  lineFieldsARR = lineFieldsARR.map(field => field.trim());
  const data: any = {};
  let intChk = NaN;
  let floatChk = NaN;
  let booleanChk = "FALSE";
  lineFieldsARR.forEach((field, index) => {
    if (currentIsRequiredARR[index] && field.trim().length === 0) {
      throw new Error("ERROR:SampleData:processRow:createRecord: Required field is missing.");
    } else if (field.trim().length > 0) {
      switch (currentTypesARR[index].toUpperCase()) {
        case "INT":
          intChk = parseInt(field);
          floatChk = parseFloat(field);
          if (Number.isNaN(intChk) || intChk !== floatChk) {
            throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Int:${field}`);
          }
          data[currentKeysARR[index]] = intChk;
          break;
        case "FLOAT":
          floatChk = parseFloat(field);
          if (Number.isNaN(floatChk)) {
            throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Float:${field}`);
          }
          data[currentKeysARR[index]] = floatChk;
          break;
        case "BOOLEAN":
          booleanChk = field.toString().toUpperCase();
          if (booleanChk !== "TRUE" && booleanChk !== "FALSE") {
            throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Boolean:${field}`);
          }
          data[currentKeysARR[index]] = booleanChk === "TRUE";
          break;
        case "STRING":
          // Attempt to remove double quotes that Excel insists on placing around some text. This currently fails for multi-line I think. Best way is to fix this in text file by replacing \t" && "\t with \t
          data[currentKeysARR[index]] = field.replace(/^"(.*)"$/, "$1").trim();
          break;
        default:
          if (field.toString().slice(0, 1) === "{") {
            data[currentKeysARR[index]] = JSON.parse(field.toString().replace(/'/gi, '"'));
          } else {
            throw new Error(
              `ERROR:SampleData:processRow:createRecord: Custom field expects an object:${field}`
            );
          }
      }
    }
  });
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  console.log(data);

  switch (category.toUpperCase()) {
    case "USER":
      return prisma.createUser(data);
    case "POST":
      return prisma.createPost(data);
    case "COMMENT":
      return prisma.createComment(data);
    case "ARTIST":
      return prisma.createArtist(data);
    case "ARTWORK":
      return prisma.createArtwork(data);
    case "ARTWORKLOCATION":
      return prisma.createArtworkLocation(data);
    default:
      throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Category:${category}`);
  }
};

export default processRow
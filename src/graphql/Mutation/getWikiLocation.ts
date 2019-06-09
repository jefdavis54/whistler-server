import axios from "axios";
import cheerio from "cheerio";
import { dataObj, errObj } from "../../util/responseShaperSERVER";
import { ArtworkLocation } from "../../lib/typsescriptInterfaces";

const initialLocation: ArtworkLocation = {
  easyId: "",
  isPublished: true,
  wikiPage: "",
  wikiPhoto: "",
  imageLink: "",
  name: "",
  nickname: "",
  description: "",
  dateFirstOpened: "",
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  coorE: 0,
  coorN: 0,
  website: "",
  isMuseum: true,
};

const getWikiLocation = async (parent: any, { url }: any) => {
  const location = { ...initialLocation };
  location.wikiPage = url.trim().toLowerCase();
  if (
    location.wikiPage &&
    (location.wikiPage.slice(0, 7) === "http://" || location.wikiPage.slice(0, 8) === "https://")
  ) {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const urlElems = $("table.vcard.infobox");
      const captionElems = $("table.vcard.infobox caption");
      const rowElems = $("table.vcard.infobox tr");
      if (urlElems.length > 0) {
        location.name = captionElems.text();
        rowElems.each((index, element) => {
          console.log(index);
          console.log($(element).text());
        });
        return dataObj([], location);
      }
      return errObj("URL provided does not have a supported format.");
    } catch (err) {
      console.log("zJED:BE:getWikiLocation:: axios error", err);
    }
  }
  return errObj("Invalid URL or site unavailable.");
};

export default getWikiLocation;

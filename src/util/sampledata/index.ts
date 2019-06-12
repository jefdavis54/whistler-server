import processFile from "./processFile";

// Note: This will clear all tables, but leave the ADMIN_EMAIL_LCASE user.
// Does not support adding sample data to AuctionArtwork AuctionArtworkBid (But will clear those tables)

const main = async () => {
  const filename =
    "c:\\zJED\\learn\\wesbos-AR1\\sick-fits\\backend\\src\\util\\sampledata\\sampledata.txt";
  const response = await processFile(filename);
  if (response) {
    console.log("Completed Successfully!");
  } else {
    console.log("Unexpected end of processing...\n", response);
  }
};

main();

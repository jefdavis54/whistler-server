import { PrismaCtx } from "../../lib/typsescriptInterfaces";

const clearTable = (category: string, prisma: PrismaCtx) => {
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
  if (!supportedCategories.includes(category.toUpperCase())) {
    throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Category:${category}`);
  }
  switch (category.toUpperCase()) {
    case "USER":
      return prisma.deleteManyUsers({ email_lcase_not: process.env.ADMIN_EMAIL_LCASE });
    case "POST":
      return prisma.deleteManyPosts();
    case "COMMENT":
      return prisma.deleteManyComments();
    case "ARTIST":
      return prisma.deleteManyArtists();
    case "ARTWORK":
      return prisma.deleteManyArtworks();
    case "ARTWORKLOCATION":
      return prisma.deleteManyArtworkLocations();
    case "AUCTIONARTWORK":
      return prisma.deleteManyAuctionArtworks();
    case "AUCTIONARTWORKBID":
      return prisma.deleteManyAuctionArtworkBids();
    default:
      throw new Error(`ERROR:SampleData:processRow:createRecord: Invalid Category:${category}`);
  }
};

export default clearTable;

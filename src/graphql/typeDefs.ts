import { gql } from "apollo-server";

const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.
  type Query {
    users(withName: String): UsersResponse!
    artists: ArtistsResponse!
    artworks: ArtworksResponse!
    artworkLocations: ArtworkLocationsResponse!
    me: MeResponse!
  }
  type Mutation {
    createUser(data: CreateUserInput!): MeResponse!
    createArtworkLocation(data: CreateArtworkLocationInput!): ArtworkLocationResponse!
    getWikiLocation(url: String!): WikiLocation!
    loginUser(data: LoginUserInput!): MeResponse!
  }
  type User {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    name: String!
    name_lcase: String!
    email: String!
    email_lcase: String!
    emailValidated: Boolean!
    active: Boolean!
    posts: [Post!]!
    comments: [Comment!]!
    artistRecords: [Artist!]!
    artworkRecords: [Artwork!]!
    artworkLocationRecords: [ArtworkLocation!]!
    auctionArtworkSeller: [AuctionArtwork!]!
    auctionArtworkBuyer: [AuctionArtwork!]!
    auctionArtworkWatcher: [AuctionArtwork!]!
    auctionArtworkBid: [AuctionArtworkBid!]!
    password: String!
    resetToken: String
    resetTokenExpiry: String
    permissions: [PermissionsType!]!
  }
  type Me {
    name: String!
    email: String!
  }
  type Post {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    owner: User!
    title: String!
    title_lcase: String!
    body: String!
    body_lcase: String!
    isPublished: Boolean!
    comments: [Comment!]!
  }
  type Comment {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    owner: User!
    post: Post!
    text: String!
    text_lcase: String!
    isPublished: Boolean!
  }
  type Artist {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    owner: User!
    isPublished: Boolean!
    wikiPage: String
    wikiPhoto: String
    imageLink: String
    birthName: String
    commonName: String
    dateOfBirth: String
    dateOfBirthAccuracy: String
    dateOfDeath: String
    dateOfDeathAccuracy: String
    nationality: String
    knownFor: String
    movements: String
    gender: String
    artworks: [Artwork!]!
    artworkLocations: [ArtworkLocation!]!
    deceased: Boolean!
    birthCountry: String
    birthLocation: String
    birthLocationDetails: String
    deathCountry: String
    deathLocation: String
    deathLocationDetails: String
    imageMaxName: String
    imageMaxWidth: Int
    imageMaxHeight: Int
    imageOptName: String
    imageOptWidth: Int
    imageOptHeight: Int
    imageThmName: String
    imageThmWidth: Int
    imageThmHeight: Int
  }
  type ArtworkLocation {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    owner: User!
    isPublished: Boolean!
    wikiPage: String
    wikiPhoto: String
    imageLink: String
    name: String!
    nickname: String
    description: String
    dateFirstOpened: String
    streetAddress: String
    city: String
    state: String
    postalCode: String
    country: String
    coorE: Int
    coorN: Int
    website: String
    isMuseum: Boolean!
    imageMaxName: String
    imageMaxWidth: Int
    imageMaxHeight: Int
    imageOptName: String
    imageOptWidth: Int
    imageOptHeight: Int
    imageThmName: String
    imageThmWidth: Int
    imageThmHeight: Int
    artworks: [Artwork!]!
    artists: [Artist!]!
  }
  type Artwork {
    id: String!
    easyId: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    owner: User!
    isPublished: Boolean!
    wikiPage: String
    wikiPhoto: String
    imageLink: String
    artist: Artist!
    notableWork: Boolean!
    artworkLocation: ArtworkLocation!
    artworkLocationURL: String
    fileName: String
    workName: String
    workName_english: String
    workName_ascii: String
    dateCompleted: String
    dateCompletedAccuracy: String
    type: String
    genre: String
    medium: String
    mediumSupport: String
    description: String
    descriptionSource: String
    accession: String
    creditLine: String
    dimensionCoreW_mm: Int
    dimensionCoreH_mm: Int
    dimensionCoreD_mm: Int
    dimensionCoreWHD_in: String
    dimensionFramedW_mm: Int
    dimensionFramedH_mm: Int
    dimensionFramedD_mm: Int
    dimensionFramedWHD_in: String
    signature: String
    onviewAt: String
    otherDescription: String
    imageMaxName: String
    imageMaxWidth: Int
    imageMaxHeight: Int
    imageOptName: String
    imageOptWidth: Int
    imageOptHeight: Int
    imageThmName: String
    imageThmWidth: Int
    imageThmHeight: Int
    auctions: [AuctionArtwork!]!
  }
  type AuctionArtwork {
    id: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    isPublished: Boolean!
    startDate: String
    endDate: String
    withdrawnDate: String
    saleDate: String
    refundDate: String
    reserve: Int
    initialPrice: Int
    buyoutPrice: Int
    salePrice: Int
    artwork: Artwork!
    seller: User!
    buyer: User
    bids: [AuctionArtworkBid!]!
    watchers: [User!]!
  }
  type AuctionArtworkBid {
    id: String!
    createdAt: String!
    updatedAt: String!
    deletedAt: String
    auction: AuctionArtwork!
    bidder: User
    amount: Int
  }
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
  input CreateArtworkLocationInput {
    easyId: String!
    isPublished: Boolean
    wikiPage: String
    wikiPhoto: String
    imageLink: String
    name: String
    nickname: String
    description: String
    dateFirstOpened: String
    streetAddress: String
    city: String
    state: String
    postalCode: String
    country: String
    coorE: Int
    coorN: Int
    website: String
    isMuseum: Boolean
    imageMaxName: String
    imageMaxWidth: Int
    imageMaxHeight: Int
    imageOptName: String
    imageOptWidth: Int
    imageOptHeight: Int
    imageThmName: String
    imageThmWidth: Int
    imageThmHeight: Int
  }
  type MeResponse {
    errors: [String!]!
    data: Me
    token: String
  }
  type UsersResponse {
    errors: [String!]!
    data: [User!]
  }
  type ArtistsResponse {
    errors: [String!]!
    data: [Artist!]
  }
  type ArtworksResponse {
    errors: [String!]!
    data: [Artwork!]
  }
  type UserResponse {
    errors: [String!]!
    data: User
  }
  type ArtistResponse {
    errors: [String!]!
    data: Artist
  }
  type ArtworkResponse {
    errors: [String!]!
    data: Artwork
  }
  type ArtworkLocationsResponse {
    errors: [String!]!
    data: [ArtworkLocation!]
  }
  type ArtworkLocationResponse {
    errors: [String!]!
    data: ArtworkLocation
  }
  # zJED TODO: Remove type WikiLocation
  type WikiLocation {
    errors: [String!]!
    data: SimpleWikiLocation
  }
  type SimpleWikiLocation {
    easyId: String!
    wikiPage: String!
  }
  input LoginUserInput {
    email: String!
    password: String!
  }
  enum PermissionsType {
    USER
    ADMIN
    USER_PERMISSIONS_OBJ_UPDATE
  }
`;

export default typeDefs;

const PRISMA_ID_LENGTH = 25;
// PRISMA_DEFAULT_MAX_STR_LENGTH is arbitrary as prisma generally allows for unlimited string lengths. In practice, though, the server should only allow that on select fields.
const PRISMA_DEFAULT_MAX_STR_LENGTH = 255;
const SERVER_DEFAULT_TOKEN_EXPIRY = "7d";
const PERMISSIONS_OBJ = {
  USER: "USER",
  ADMIN: "ADMIN",
};
const MUTATION_TYPE = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
};

export { PRISMA_ID_LENGTH, PRISMA_DEFAULT_MAX_STR_LENGTH, SERVER_DEFAULT_TOKEN_EXPIRY, PERMISSIONS_OBJ, MUTATION_TYPE }



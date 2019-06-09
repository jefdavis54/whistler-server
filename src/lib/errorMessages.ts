// Provide a consistent not authorized message when needed
const ERR_01_NOT_AUTHORIZED = "ERROR:SERVER:CODE01:: Requester not authorized...";

// This is returned if a request is made to the database that could expose records that where deleted.
const ERR_02_ACCESS_VIOLATION = "ERROR:SERVER:CODE02:: Invalid server request to prisma database.";

// A base assumption of this database is to have this flag in all tables
const ERR_03_NO_DELETEDAT_FLAG = "ERROR:SERVER:CODE03:: Unexpected prisma response shape.";

export { ERR_01_NOT_AUTHORIZED, ERR_02_ACCESS_VIOLATION, ERR_03_NO_DELETEDAT_FLAG }
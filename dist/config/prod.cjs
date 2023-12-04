"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
module.exports = {
    dbURL: process.env.ATLAS_URL,
    dbName: process.env.ATLAS_DB_NAME,
};
//# sourceMappingURL=prod.cjs.map
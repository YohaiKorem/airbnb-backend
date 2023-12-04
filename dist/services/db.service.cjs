"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbService = void 0;
const { MongoClient } = require('mongodb');
const config = require('../config/index.cjs');
const logger = require('./logger.service.cjs');
const logger_service_cjs_1 = require("./logger.service.cjs");
exports.dbService = {
    getCollection,
};
// const dbName = 'airbnb_db'
var dbConn = null;
async function getCollection(collectionName) {
    try {
        const db = await connect();
        const collection = await db.collection(collectionName);
        return collection;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get Mongo collection', err);
        throw err;
    }
}
async function connect() {
    if (dbConn)
        return dbConn;
    try {
        const client = await MongoClient.connect(config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = client.db(config.dbName);
        dbConn = db;
        return db;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Cannot Connect to DB', err);
        throw err;
    }
}
//# sourceMappingURL=db.service.cjs.map
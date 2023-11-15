"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { log } = require('../../middlewares/logger.middleware.cjs');
const db_service_cjs_1 = require("../../services/db.service.cjs");
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const mongodb_1 = require("mongodb");
module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
};
async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy);
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        var users = await collection.find(criteria).toArray();
        users = users.map((user) => {
            delete user.password;
            // user.createdAt = new ObjectId(user._id).getTimestamp()
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user;
        });
        return users;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot find users', err);
        throw err;
    }
}
async function getById(userId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        const user = await collection.findOne({ _id: new mongodb_1.ObjectId(userId) });
        delete user.password;
        return user;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding user ${userId}`, err);
        throw err;
    }
}
async function getByUsername(username) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        const user = await collection.findOne({ username });
        return user;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding user ${username}`, err);
        throw err;
    }
}
async function remove(userId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        await collection.deleteOne({ _id: new mongodb_1.ObjectId(userId) });
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot remove user ${userId}`, err);
        throw err;
    }
}
async function update(user) {
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: new mongodb_1.ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            tasks: user.tasks,
            stays: user.tasks,
        };
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave });
        return userToSave;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot update user ${user._id}`, err);
        throw err;
    }
}
async function add(user) {
    try {
        // Validate that there are no such user:
        const existUser = await getByUsername(user.username);
        if (existUser)
            throw new Error('Username taken');
        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            isAdmin: false,
            tasks: [],
            stays: [],
        };
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        await collection.insertOne(userToAdd);
        return userToAdd;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot insert user', err);
        throw err;
    }
}
function _buildCriteria(filterBy) {
    const criteria = {};
    // if (filterBy.txt) {
    //   const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
    //   criteria.$or = [
    //     {
    //       username: txtCriteria,
    //     },
    //     {
    //       fullname: txtCriteria,
    //     },
    //   ]
    // }
    // if (filterBy.minBalance) {
    //   criteria.balance = { $gte: filterBy.minBalance }
    // }
    return criteria;
}
//# sourceMappingURL=user.service.cjs.map
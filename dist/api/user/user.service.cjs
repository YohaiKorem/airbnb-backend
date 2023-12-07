"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { log } = require('../../middlewares/logger.middleware.cjs');
const db_service_cjs_1 = require("../../services/db.service.cjs");
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const mongodb_1 = require("mongodb");
const user_model_cjs_1 = require("../../models/user.model.cjs");
module.exports = {
    query,
    getById,
    getByUsername,
    remove,
    update,
    add,
    addFromSocial,
    getBySocialId,
    initUserData,
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
async function getById(userId, isSocial = false) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        const user = await collection.findOne({ _id: userId });
        if (!user) {
            if (isSocial)
                return null;
            throw new Error('User not found');
        }
        delete user.password;
        return user;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding user ${userId}`, err);
        if (!isSocial)
            throw err;
        else
            return null;
    }
}
async function getBySocialId(userId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        const user = await collection.findOne({ id: userId });
        if (!user)
            return null;
        delete user.password;
        return user;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding user ${userId}`, err);
        return null;
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
    const { _id, ...updatedData } = user;
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        let updatedUser;
        if (user.id) {
            await collection.updateOne({ id: user.id }, { $set: updatedData });
            updatedUser = await collection.findOne({ id: user.id });
        }
        else if (!user.id) {
            await collection.updateOne({ _id: new mongodb_1.ObjectId(user._id) }, { $set: updatedData });
            updatedUser = await collection.findOne({ _id: new mongodb_1.ObjectId(user._id) });
        }
        if (!updatedUser)
            throw new Error('User not found');
        delete updatedUser.password;
        return updatedUser;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot update user ${user._id}`, err);
        throw err;
    }
}
async function add(user) {
    try {
        const existUser = await getByUsername(user.username);
        if (existUser)
            throw new Error('invalid username or password');
        const userToAdd = new user_model_cjs_1.User(user.fullname, user.imgUrl, user.username, [], false, user.password);
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        await collection.insertOne(userToAdd);
        return userToAdd;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot insert user', err);
        throw err;
    }
}
async function addFromSocial(socialUser) {
    try {
        const newUser = socialUser.provider === 'FACEBOOK'
            ? {
                fullname: socialUser.name,
                // the image is hashed by facebook
                imgUrl: '',
                username: socialUser.firstName,
                wishlists: [],
                isOwner: false,
                password: socialUser.authToken,
                id: socialUser.id,
            }
            : {
                fullname: socialUser.name,
                imgUrl: socialUser.photoUrl,
                username: socialUser.firstName,
                wishlists: [],
                isOwner: false,
                password: socialUser.idToken,
                id: socialUser.id,
            };
        const collection = await db_service_cjs_1.dbService.getCollection('user');
        await collection.insertOne(newUser);
        return newUser;
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
// export async function initUserData() {
//   const bcrypt = require('bcrypt')
//   const users = require('../../../src/data/user.json')
//   const saltRounds = 10
//   try {
//     const hashedUsers = await Promise.all(
//       users.map(async (user) => {
//         const hash = await bcrypt.hash(user.password, saltRounds)
//         return { ...user, _id: new ObjectId(user._id), password: hash }
//       })
//     )
//     const collection = await dbService.getCollection('user')
//     await collection.insertMany(hashedUsers)
//   } catch (err) {
//     loggerService.error('Failed to insert entities or create index', err)
// }
// }
//# sourceMappingURL=user.service.cjs.map
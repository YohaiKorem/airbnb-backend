"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const db_service_cjs_1 = require("../../services/db.service.cjs");
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const mongodb_1 = require("mongodb");
const asyncLocalStorage = require('../../services/als.service.cjs');
async function query(id, entityType) {
    let criteria = {};
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        if (entityType === 'all')
            criteria = { $or: [{ hostId: id }, { 'buyer._id': id }] };
        if (entityType === 'host')
            criteria = { hostId: id };
        if (entityType === 'buyer')
            criteria = { 'buyer._id': id };
        const orders = await collection.find(criteria).toArray();
        return orders;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot find orders for ${entityType} with id of ${id}`, err);
        throw err;
    }
}
async function getById(id) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        const order = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
        return order;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding order ${id}`, err);
        throw err;
    }
}
async function update(order) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        const { _id, ...updateData } = order;
        await collection.updateOne({ _id: new mongodb_1.ObjectId(_id) }, { $set: updateData });
        const updatedOrder = await collection.findOne({
            _id: new mongodb_1.ObjectId(_id),
        });
        if (!updatedOrder)
            throw new Error('Order not found');
        return updatedOrder;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot update order ${order._id}`, err);
        throw err;
    }
}
// async function remove(orderId) {
//   try {
//     const store = asyncLocalStorage.getStore()
//     const { loggedinUser } = store
//     const collection = await dbService.getCollection('order')
//     // remove only if user is owner/admin
//     const criteria = { _id: ObjectId(orderId) }
//     if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
//     const { deletedCount } = await collection.deleteOne(criteria)
//     return deletedCount
//   } catch (err) {
//     loggerService.error(`cannot remove order ${orderId}`, err)
//     throw err
//   }
// }
async function add(order) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        const newOrder = { ...order };
        newOrder._id = new mongodb_1.ObjectId();
        const result = await collection.insertOne(newOrder);
        if (!result.acknowledged || !result.insertedId)
            throw new Error('Insertion failed');
        const savedOrder = await collection.findOne({
            _id: result.insertedId,
        });
        return savedOrder;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot insert order', err);
        throw err;
    }
}
function _buildCriteria(filterBy) {
    let criteria;
    if (filterBy.hostId)
        criteria.hostId = filterBy.hostId;
    return criteria;
}
module.exports = {
    query,
    // remove,
    add,
    update,
    getById,
};
exports.orderService = {
    query,
    // remove,
    add,
    update,
    getById,
};
//# sourceMappingURL=order.service.cjs.map
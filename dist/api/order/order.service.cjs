"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_cjs_1 = require("../../models/order.model.cjs");
const db_service_cjs_1 = require("../../services/db.service.cjs");
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const asyncLocalStorage = require('../../services/als.service.cjs');
async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy);
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        var orders = await collection
            .aggregate([
            {
                $match: criteria,
            },
            {
                $lookup: {
                    from: 'user',
                    localField: 'buyerId',
                    foreignField: '_id',
                    as: 'buyerDetails',
                },
            },
            {
                $unwind: '$buyerDetails',
            },
            {
                $lookup: {
                    from: 'stay',
                    localField: 'stayId',
                    foreignField: '_id',
                    as: 'stayDetails',
                },
            },
            {
                $unwind: '$stayDetails',
            },
            {
                $project: {
                    _id: 1,
                    hostId: '$hostId',
                    buyer: {
                        _id: '$buyerDetails._id',
                        fullname: '$buyerDetails.fullname', // Assuming 'fullname' is a field in 'user' collection
                        // Add other buyer details as needed
                    },
                    totalPrice: '$totalPrice',
                    checkin: '$checkin',
                    checkout: '$checkout',
                    guests: '$guests',
                    stay: {
                        _id: '$stayDetails._id',
                        name: '$stayDetails.name',
                        price: '$stayDetails.price',
                        address: '$stayDetails.address', // Assuming 'address' is a field in 'stay' collection
                    },
                    msgs: '$msgs',
                    status: '$status', // Assuming 'status' is the field in 'order' collection
                },
            },
        ])
            .toArray();
        return orders.map((order) => {
            // Convert MongoDB _id to string
            order._id = order._id.toString();
            order.buyer._id = order.buyer._id.toString();
            order.stay._id = order.stay._id.toString();
            return order;
        });
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot find orders', err);
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
        const orderToAdd = new order_model_cjs_1.Order('', order.hostId, order.buyer, order.totalPrice, order.checkin, order.checkout, order.guests, order.stay, order.msgs, order.status);
        const collection = await db_service_cjs_1.dbService.getCollection('order');
        await collection.insertOne(orderToAdd);
        return orderToAdd;
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
};
//# sourceMappingURL=order.service.cjs.map
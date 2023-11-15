import { Order } from '../../models/order.model.cjs'
import { dbService } from '../../services/db.service.cjs'

import { loggerService } from '../../services/logger.service.cjs'

import { ObjectId } from 'mongodb'

const asyncLocalStorage = require('../../services/als.service.cjs')

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('order')
    var orders = await collection
      .aggregate([
        {
          $match: criteria,
        },
        {
          $lookup: {
            from: 'user',
            localField: 'buyerId', // Assuming 'buyerId' is the field in 'order' collection
            foreignField: '_id',
            as: 'buyerDetails',
          },
        },
        {
          $unwind: '$buyerDetails',
        },
        {
          $lookup: {
            from: 'stay', // Assuming there is a 'stay' collection
            localField: 'stayId', // Assuming 'stayId' is the field in 'order' collection
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
            hostId: '$hostId', // Assuming 'hostId' is the field in 'order' collection
            buyer: {
              _id: '$buyerDetails._id',
              fullname: '$buyerDetails.fullname', // Assuming 'fullname' is a field in 'user' collection
              // Add other buyer details as needed
            },
            totalPrice: '$totalPrice', // Assuming 'totalPrice' is the field in 'order' collection
            checkin: '$checkin', // Assuming 'checkin' is the field in 'order' collection
            checkout: '$checkout', // Assuming 'checkout' is the field in 'order' collection
            guests: '$guests', // Assuming 'guests' is the field in 'order' collection
            stay: {
              _id: '$stayDetails._id',
              name: '$stayDetails.name', // Assuming 'name' is a field in 'stay' collection
              price: '$stayDetails.price', // Assuming 'price' is a field in 'stay' collection
              address: '$stayDetails.address', // Assuming 'address' is a field in 'stay' collection
            },
            msgs: '$msgs', // Assuming 'msgs' is the field in 'order' collection
            status: '$status', // Assuming 'status' is the field in 'order' collection
          },
        },
      ])
      .toArray()

    return orders.map((order) => {
      // Convert MongoDB _id to string
      order._id = order._id.toString()
      order.buyer._id = order.buyer._id.toString()
      order.stay._id = order.stay._id.toString()
      return order
    })
  } catch (err) {
    loggerService.error('cannot find orders', err)
    throw err
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

async function add(order: Order) {
  try {
    const orderToAdd = new Order(
      '',
      order.hostId,
      order.buyer,
      order.totalPrice,
      order.checkin,
      order.checkout,
      order.guests,
      order.stay,
      order.msgs,
      order.status
    )
    const collection = await dbService.getCollection('order')
    await collection.insertOne(orderToAdd)
    return orderToAdd
  } catch (err) {
    loggerService.error('cannot insert order', err)
    throw err
  }
}

function _buildCriteria(filterBy) {
  let criteria: { hostId: string }
  if (filterBy.hostId) criteria.hostId = filterBy.hostId
  return criteria
}

module.exports = {
  query,
  // remove,
  add,
}

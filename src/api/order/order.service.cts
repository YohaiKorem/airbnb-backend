import { Msg } from '../../models/msg.model.cjs'
import { Order } from '../../models/order.model.cjs'
import { dbService } from '../../services/db.service.cjs'
import { utilService } from '../../services/util.service.cjs'
import { loggerService } from '../../services/logger.service.cjs'

import { ObjectId } from 'mongodb'

const asyncLocalStorage = require('../../services/als.service.cjs')

async function query(id: string, entityType: string) {
  let criteria: any = {}
  try {
    const collection = await dbService.getCollection('order')
    if (entityType === 'all')
      criteria = { $or: [{ hostId: id }, { 'buyer._id': id }] }
    if (entityType === 'host') criteria = { hostId: id }
    if (entityType === 'buyer') criteria = { 'buyer._id': id }
    const orders = await collection.find(criteria).toArray()
    return orders
  } catch (err) {
    loggerService.error(
      `cannot find orders for ${entityType} with id of ${id}`,
      err
    )
    throw err
  }
}

async function getById(id: string) {
  try {
    const collection = await dbService.getCollection('order')
    const order = await collection.findOne({ _id: new ObjectId(id) })
    return order
  } catch (err) {
    loggerService.error(`while finding order ${id}`, err)
    throw err
  }
}

async function update(order: Order) {
  try {
    const collection = await dbService.getCollection('order')
    const { _id, ...updateData } = order

    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateData })
    const updatedOrder: Order = await collection.findOne({
      _id: new ObjectId(_id),
    })
    if (!updatedOrder) throw new Error('Order not found')
    return updatedOrder
  } catch (err) {
    loggerService.error(`cannot update order ${order._id}`, err)
    throw err
  }
}

async function addMsg(orderId: string, msg: Msg) {
  try {
    const msgToAdd = { ...msg }
    msgToAdd.id = utilService.makeId()
    const orderToUpdate = await getById(orderId)
    orderToUpdate.msgs = orderToUpdate.msgs.concat(msgToAdd)
    const updatedOrder = await update(orderToUpdate)
    return updatedOrder
  } catch (err) {
    loggerService.error(`cannot update message in order ${orderId}`, err)
    throw err
  }
}

// async function remove(orderId) {
//   try {
//     const store = asyncLocalStorage.getStore()
//     const { loggedInUser } = store
//     const collection = await dbService.getCollection('order')
//     // remove only if user is owner/admin
//     const criteria = { _id: ObjectId(orderId) }
//     if (!loggedInUser.isAdmin) criteria.byUserId = ObjectId(loggedInUser._id)
//     const { deletedCount } = await collection.deleteOne(criteria)
//     return deletedCount
//   } catch (err) {
//     loggerService.error(`cannot remove order ${orderId}`, err)
//     throw err
//   }
// }

async function add(order: Order) {
  try {
    const collection = await dbService.getCollection('order')
    const newOrder: any = { ...order }
    newOrder._id = new ObjectId()
    const result = await collection.insertOne(newOrder)
    if (!result.acknowledged || !result.insertedId)
      throw new Error('Insertion failed')
    const savedOrder: Order = await collection.findOne({
      _id: result.insertedId,
    })

    return savedOrder
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
  update,
  getById,
  addMsg,
}

export const orderService = {
  query,
  // remove,
  add,
  update,
  getById,
  addMsg,
}

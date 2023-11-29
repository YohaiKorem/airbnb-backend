import { dbService } from '../../services/db.service.cjs'
import { loggerService } from '../../services/logger.service.cjs'
import { utilService } from '../../services/util.service.cjs'
import { ObjectId } from 'mongodb'
import { Stay, StayFilter, SearchParam } from '../../models/stay.model.cjs'
import { User } from '../../models/user.model.cjs'
import { StayHost } from '../../models/host.model.cjs'
import { Order } from '../../models/order.model.cjs'
const orderService = require('../order/order.service.cjs')

export async function query(data): Promise<Stay[]> {
  const criteria = _buildCriteria(data)
  const { pagination } = data
  console.log(pagination)
  try {
    const collection = await dbService.getCollection('stay')
    const stays = await collection
      .find(criteria)
      .skip(pagination.pageIdx * pagination.pageSize)
      .limit(pagination.pageSize)
      .toArray()

    let modifiedStays = stays.map((stay) => _normalizeStayForFrontend(stay))

    return modifiedStays
  } catch (err) {
    loggerService.error('cannot find stays', err)
    throw err
  }
}

export async function getById(stayId: string): Promise<Stay> {
  try {
    const collection = await dbService.getCollection('stay')
    const stay = await collection.findOne({ _id: new ObjectId(stayId) })
    const modifiedStay = _normalizeStayForFrontend(stay)
    return modifiedStay
  } catch (err) {
    loggerService.error(`while finding stay ${stayId}`, err)
    throw err
  }
}

export async function remove(stayId: string): Promise<void> {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.deleteOne({ _id: new ObjectId(stayId) })
  } catch (err) {
    loggerService.error(`cannot remove stay ${stayId}`, err)
    throw err
  }
}

export async function add(stay: Stay): Promise<Stay> {
  try {
    const collection = await dbService.getCollection('stay')
    const noramlizedStay = _normalizeStayForBackend(stay)
    noramlizedStay._id = new ObjectId()
    const result = await collection.insertOne(noramlizedStay)
    if (!result.acknowledged || !result.insertedId)
      throw new Error('Insertion failed')
    const savedStay: Stay = await collection.findOne({ _id: result.insertedId })
    const normalizedSavedStay = _normalizeStayForFrontend(savedStay)
    return normalizedSavedStay
  } catch (err) {
    loggerService.error('cannot insert stay', err)
    throw err
  }
}

export async function update(stay: Stay): Promise<Stay> {
  try {
    const collection = await dbService.getCollection('stay')

    const noramlizedStayForBackend = _normalizeStayForBackend(stay)
    const { _id, ...updateData } = noramlizedStayForBackend

    await collection.updateOne({ _id: new ObjectId(_id) }, { $set: updateData })
    const updatedStay: Stay = await collection.findOne({
      _id: new ObjectId(_id),
    })
    if (!updatedStay) throw new Error('Stay not found')
    const orderCollection = await dbService.getCollection('order')
    const relevantOrders = await orderCollection
      .find({ 'stay._id': _id })
      .toArray()
    relevantOrders.forEach(async (order: Order) => {
      const updatedOrder = { ...order }
      updatedOrder.stay = {
        _id: stay._id,
        name: stay.name,
        price: stay.price,
        address: stay.loc.city,
      }
      await orderService.update(updatedOrder)
    })
    const noramlizedStayForFrontend = _normalizeStayForFrontend(updatedStay)
    return noramlizedStayForFrontend
  } catch (err) {
    loggerService.error(`cannot update stay ${stay._id}`, err)
    throw err
  }
}

async function getHostById(hostId: string): Promise<StayHost | null> {
  try {
    const collection = await dbService.getCollection('stay')
    const stay: Stay = await collection.findOne({ 'host._id': hostId })
    return stay ? stay.host : null
  } catch (err) {
    loggerService.error('cannot find host', err)
    throw err
  }
}

export async function getAllHostStaysById(hostId: string): Promise<Stay[]> {
  try {
    const collection = await dbService.getCollection('stay')
    const stays: Stay[] = await collection
      .find({ 'host._id': hostId })
      .toArray()
    return stays
  } catch (err) {
    loggerService.error('cannot find stays for host', err)
    throw err
  }
}

export async function updateStayMsg(msg, stayId) {
  try {
    await removeStayMsg(stayId, msg.id)
    await addStayMsg(stayId, msg)
    return msg
  } catch (err) {
    console.log(err, `cannot update stay with msg ${msg}`)
    throw err
  }
}

export async function addStayMsg(stayId, msg) {
  try {
    if (!msg.id) msg.id = utilService.makeId()
    const collection = await dbService.getCollection('stay')
    await collection.updateOne(
      { _id: new ObjectId(stayId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    loggerService.error(`cannot add stay msg ${msg}`, err)
    throw err
  }
}

export async function removeStayMsg(stayId, msgId) {
  try {
    const collection = await dbService.getCollection('stay')
    await collection.updateOne(
      { _id: new ObjectId(stayId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    loggerService.error(`cannot remove stay msg ${msgId}`, err)
    throw err
  }
}

function _normalizeStayForFrontend(stay: any) {
  stay = { ...stay }
  stay.loc.lng = stay.loc.coordinates[0]
  stay.loc.lat = stay.loc.coordinates[1]
  delete stay.loc.type
  delete stay.loc.coordinates
  return stay
}

function _normalizeStayForBackend(stay: Stay) {
  var newLoc = {
    type: 'Point',
    coordinates: [stay.loc.lng, stay.loc.lat],
    country: stay.loc.country,
    countryCode: stay.loc.countryCode,
    city: stay.loc.city,
    address: stay.loc.address,
  }
  const newStay: any = { ...stay }
  newStay.loc = newLoc
  return newStay
}

function _buildCriteria(data: { filter: StayFilter; search: SearchParam }) {
  const { filter, search } = data

  const filterCriteria = _buildFilterCriteria(filter)
  const searchCriteria = _buildSearchCriteria(search)
  return {
    ...filterCriteria,
    ...searchCriteria,
  }
}

function _buildSearchCriteria(search: SearchParam) {
  const criteria = {}
  if (search.guests && +search.guests.adults) {
    let totalGuests = search.guests.adults + (search.guests.children || 0)
    criteria['capacity'] = { $gte: totalGuests }
  }

  if (search.location && search.location.name && search.location.coords) {
    const distanceLimitInMeters = 5000
    criteria['loc'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [search.location.coords.lng, search.location.coords.lat],
        },
        $maxDistance: distanceLimitInMeters,
      },
    }
  }
  return criteria
}

function _buildFilterCriteria(filter: StayFilter) {
  const criteria = {}

  if (filter.labels && filter.labels.length) {
    if (Array.isArray(filter.labels))
      criteria['$or'] = [
        { labels: filter.labels[0] },
        { type: filter.labels[0] },
      ]
    else criteria['$or'] = [{ labels: filter.labels }, { type: filter.labels }]
  }

  if (filter.equipment) {
    if (filter.equipment.bathNum) {
      criteria['equipment.bathNum'] = { $gte: filter.equipment.bathNum }
    }
    if (filter.equipment.bedsNum) {
      criteria['equipment.bedsNum'] = { $gte: filter.equipment.bedsNum }
    }
    if (filter.equipment.bedroomNum) {
      criteria['equipment.bedroomNum'] = { $gte: filter.equipment.bedroomNum }
    }
  }

  if (filter.amenities && filter.amenities.length) {
    if (!Array.isArray(filter.amenities)) filter.amenities = [filter.amenities]
    criteria['amenities'] = { $all: filter.amenities }
  }

  if (filter.superhost === true) {
    criteria['host.isSuperhost'] = true
  }

  if (Number(filter.maxPrice)) {
    criteria['price'] = { $lte: filter.maxPrice }
  }

  if (Number(filter.minPrice)) {
    criteria['price'] = criteria['price'] || {}
    criteria['price']['$gte'] = filter.minPrice
  }

  if (Object.keys(criteria).length === 0) return null

  return criteria
}

// export async function initData() {
//   const entities = require(`../../../src/data/${entity}.json`)
//   // Convert string _id to ObjectId and update loc field
//   const entitiesWithObjectId = entities.map((entity) => {
//     if (entity._id && typeof entity._id === 'string') {
//       try {
//         entity._id = new ObjectId(entity._id)
//       } catch (error) {
//         entity._id = new ObjectId()
//       }
//     }

//     var newLoc = {
//       type: 'Point',
//       coordinates: [entity.loc.lng, entity.loc.lat],
//       country: entity.loc.country,
//       countryCode: entity.loc.countryCode,
//       city: entity.loc.city,
//       address: entity.loc.address,
//     }

//     entity.loc = newLoc
//     return entity
//   })

//   try {
//     const collection = await dbService.getCollection(entity)
//     await collection.insertMany(entitiesWithObjectId)
//     console.log('Inserted entities with ObjectId')

//     await collection.createIndex({ loc: '2dsphere' })
//     console.log('2dsphere index created on loc field')
//   } catch (err) {
//     loggerService.error('Failed to insert entities or create index', err)
//   }
// }

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
  getAllHostStaysById,
  getHostById,
  updateStayMsg,
  addStayMsg,
  removeStayMsg,
}

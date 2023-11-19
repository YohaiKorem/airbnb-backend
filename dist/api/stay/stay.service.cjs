"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeStayMsg = exports.addStayMsg = exports.updateStayMsg = exports.update = exports.add = exports.remove = exports.getById = exports.query = void 0;
const db_service_cjs_1 = require("../../services/db.service.cjs");
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const util_service_cjs_1 = require("../../services/util.service.cjs");
const mongodb_1 = require("mongodb");
const stay_model_cjs_1 = require("../../models/stay.model.cjs");
async function query(data) {
    const criteria = _buildCriteria(data);
    const { pagination } = data;
    console.log(pagination);
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        const stays = await collection
            .find(criteria)
            .skip(pagination.pageIdx * pagination.pageSize)
            .limit(pagination.pageSize)
            .toArray();
        let modifiedStays = stays.map((stay) => _normalizeStayForFrontend(stay));
        return modifiedStays;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot find stays', err);
        throw err;
    }
}
exports.query = query;
async function getById(stayId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        const stay = await collection.findOne({ _id: new mongodb_1.ObjectId(stayId) });
        const modifiedStay = _normalizeStayForFrontend(stay);
        return modifiedStay;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`while finding stay ${stayId}`, err);
        throw err;
    }
}
exports.getById = getById;
async function remove(stayId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        await collection.deleteOne({ _id: new mongodb_1.ObjectId(stayId) });
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot remove stay ${stayId}`, err);
        throw err;
    }
}
exports.remove = remove;
async function add(stay) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        await collection.insertOne(stay);
        return stay;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('cannot insert stay', err);
        throw err;
    }
}
exports.add = add;
async function update(stay) {
    try {
        const stayToSave = new stay_model_cjs_1.Stay(stay._id, stay.name, stay.type, stay.imgUrls, stay.price, stay.summary, stay.capacity, stay.amenities, stay.roomType, stay.host, stay.loc, stay.reviews, stay.likedByUsers, stay.labels, stay.equipment, stay.rate);
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        await collection.updateOne({ _id: new mongodb_1.ObjectId(stay._id) }, { $set: stayToSave });
        return stay;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot update stay ${stay._id}`, err);
        throw err;
    }
}
exports.update = update;
async function updateStayMsg(msg, stayId) {
    try {
        await removeStayMsg(stayId, msg.id);
        await addStayMsg(stayId, msg);
        return msg;
    }
    catch (err) {
        console.log(err, `cannot update stay with msg ${msg}`);
        throw err;
    }
}
exports.updateStayMsg = updateStayMsg;
async function addStayMsg(stayId, msg) {
    try {
        if (!msg.id)
            msg.id = util_service_cjs_1.utilService.makeId();
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        await collection.updateOne({ _id: new mongodb_1.ObjectId(stayId) }, { $push: { msgs: msg } });
        return msg;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot add stay msg ${msg}`, err);
        throw err;
    }
}
exports.addStayMsg = addStayMsg;
async function removeStayMsg(stayId, msgId) {
    try {
        const collection = await db_service_cjs_1.dbService.getCollection('stay');
        await collection.updateOne({ _id: new mongodb_1.ObjectId(stayId) }, { $pull: { msgs: { id: msgId } } });
        return msgId;
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error(`cannot remove stay msg ${msgId}`, err);
        throw err;
    }
}
exports.removeStayMsg = removeStayMsg;
function _normalizeStayForFrontend(stay) {
    stay = { ...stay };
    stay.loc.lng = stay.loc.coordinates[0];
    stay.loc.lat = stay.loc.coordinates[1];
    delete stay.loc.type;
    delete stay.loc.coordinates;
    return stay;
}
function _buildCriteria(data) {
    const { filter, search } = data;
    const filterCriteria = _buildFilterCriteria(filter);
    const searchCriteria = _buildSearchCriteria(search);
    return {
        ...filterCriteria,
        ...searchCriteria,
    };
}
function _buildSearchCriteria(search) {
    const criteria = {};
    if (search.guests && +search.guests.adults) {
        let totalGuests = search.guests.adults + (search.guests.children || 0);
        criteria['capacity'] = { $gte: totalGuests };
    }
    if (search.location && search.location.name && search.location.coords) {
        const distanceLimitInMeters = 5000;
        criteria['loc'] = {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [search.location.coords.lng, search.location.coords.lat],
                },
                $maxDistance: distanceLimitInMeters,
            },
        };
    }
    return criteria;
}
function _buildFilterCriteria(filter) {
    const criteria = {};
    if (filter.labels && filter.labels.length) {
        if (Array.isArray(filter.labels))
            criteria['$or'] = [
                { labels: filter.labels[0] },
                { type: filter.labels[0] },
            ];
        else
            criteria['$or'] = [{ labels: filter.labels }, { type: filter.labels }];
    }
    if (filter.equipment) {
        if (filter.equipment.bathNum) {
            criteria['equipment.bathNum'] = { $gte: filter.equipment.bathNum };
        }
        if (filter.equipment.bedsNum) {
            criteria['equipment.bedsNum'] = { $gte: filter.equipment.bedsNum };
        }
        if (filter.equipment.bedroomNum) {
            criteria['equipment.bedroomNum'] = { $gte: filter.equipment.bedroomNum };
        }
    }
    if (filter.amenities && filter.amenities.length) {
        if (!Array.isArray(filter.amenities))
            filter.amenities = [filter.amenities];
        criteria['amenities'] = { $all: filter.amenities };
    }
    if (filter.superhost === true) {
        criteria['host.isSuperhost'] = true;
    }
    if (Number(filter.maxPrice)) {
        criteria['price'] = { $lte: filter.maxPrice };
    }
    if (Number(filter.minPrice)) {
        criteria['price'] = criteria['price'] || {};
        criteria['price']['$gte'] = filter.minPrice;
    }
    if (Object.keys(criteria).length === 0)
        return null;
    return criteria;
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
    updateStayMsg,
    addStayMsg,
    removeStayMsg,
};
//# sourceMappingURL=stay.service.cjs.map
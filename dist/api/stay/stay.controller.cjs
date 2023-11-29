"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stayService = require('./stay.service.cjs');
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
async function getStays(req, res) {
    let { startDate, endDate, location, guests, minPrice, maxPrice, equipment, capacity, superhost, roomType, labels, amenities, pageIdx, pageSize, } = _parseQuery(req.query);
    const search = { startDate, endDate, location, guests };
    const filter = {
        labels,
        minPrice,
        maxPrice,
        equipment,
        capacity,
        roomType,
        amenities,
        superhost,
    };
    const pagination = {
        pageIdx,
        pageSize,
    };
    try {
        logger_service_cjs_1.loggerService.debug('Getting Stays');
        const stays = await stayService.query({
            filter,
            search,
            pagination,
        });
        res.json(stays);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get stays', err);
        res.status(500).send({
            err: `Failed to get stays for filter ${req.query.filter} and search ${req.query.search}`,
        });
    }
}
async function getStayById(req, res) {
    try {
        const stayId = req.params.id;
        const stay = await stayService.getById(stayId);
        res.json(stay);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get stay', err);
        res.status(500).send({ err: 'Failed to get stay' });
    }
}
async function getAllHostStaysById(req, res) {
    const hostId = req.params.id;
    try {
        const stays = await stayService.getAllHostStaysById(hostId);
        res.json(stays);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get stays', err);
        res
            .status(500)
            .send({ err: `Failed to get stays for host with id ${hostId}` });
    }
}
async function getHostById(req, res) {
    const hostId = req.params.id;
    try {
        const host = await stayService.getHostById(hostId);
        res.json(host);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get host', err);
        res.status(500).send({ err: `Failed to get host with id ${hostId}` });
    }
}
async function addStay(req, res) {
    const { loggedInUser } = req;
    try {
        const stay = req.body;
        const addedStay = await stayService.add(stay);
        res.json(addedStay);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to add stay', err);
        res.status(500).send({ err: 'Failed to add stay' });
    }
}
async function updateStay(req, res) {
    try {
        const stay = req.body;
        const updatedStay = await stayService.update(stay);
        return res.json(updatedStay);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to update stay', err);
        res.status(500).send({ err: 'Failed to update stay' });
    }
}
async function removeStay(req, res) {
    try {
        const stayId = req.params.id;
        console.log('stayId inside removeStay', stayId);
        await stayService.remove(stayId);
        res.json(stayId);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to remove stay', err);
        res.status(500).send({ err: 'Failed to remove stay' });
    }
}
function _parseQuery(query) {
    const res = {};
    for (let [key, value] of Object.entries(query)) {
        if (typeof value === 'string') {
            try {
                res[key] = JSON.parse(value);
            }
            catch (error) {
                res[key] = value;
            }
        }
        else
            res[key] = value;
    }
    return res;
}
module.exports = {
    getStays,
    getStayById,
    addStay,
    updateStay,
    removeStay,
    getAllHostStaysById,
    getHostById,
};
//# sourceMappingURL=stay.controller.cjs.map
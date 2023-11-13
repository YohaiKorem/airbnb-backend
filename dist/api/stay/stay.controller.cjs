"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stayService = require('./stay.service.cjs');
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
async function getStays(req, res) {
    const { startDate, endDate, location, guests, minPrice, maxPrice, equipment, capacity, superhost, roomType, labels, amenities, } = req.query;
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
    try {
        logger_service_cjs_1.loggerService.debug('Getting Stays');
        const stays = await stayService.query({ filter, search });
        console.log('stays inside stay controller after querying the stayservice', stays.length);
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
        console.log(req.params, 'inside controller');
        res.json(stay);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to get stay', err);
        res.status(500).send({ err: 'Failed to get stay' });
    }
}
async function getStayMsgs(req, res) {
    console.log(req);
}
async function addStay(req, res) {
    const { loggedinUser } = req;
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
        await stayService.remove(stayId);
        res.send();
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to remove stay', err);
        res.status(500).send({ err: 'Failed to remove stay' });
    }
}
async function updateStayMsg(req, res) {
    const { loggedinUser } = req;
    try {
        const stayId = req.params.id;
        const { msgId } = req.params;
        const msg = {
            id: msgId,
            txt: req.body.txt,
            by: loggedinUser,
        };
        const updatedMsg = await stayService.updateStayMsg(msg, stayId);
        return res.json(updatedMsg);
    }
    catch (err) {
        console.log(err, 'cannot update stay message right now');
    }
}
async function addStayMsg(req, res) {
    const { loggedinUser } = req;
    try {
        const stayId = req.params.id;
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        };
        const savedMsg = await stayService.addStayMsg(stayId, msg);
        res.json(savedMsg);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to update stay', err);
        res.status(500).send({ err: 'Failed to update stay' });
    }
}
async function removeStayMsg(req, res) {
    try {
        const stayId = req.params.id;
        const { msgId } = req.params;
        const removedId = await stayService.removeStayMsg(stayId, msgId);
        res.send(removedId);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to remove stay msg', err);
        res.status(500).send({ err: 'Failed to remove stay msg' });
    }
}
module.exports = {
    getStays,
    getStayMsgs,
    getStayById,
    addStay,
    updateStay,
    removeStay,
    addStayMsg,
    removeStayMsg,
    updateStayMsg,
};
//# sourceMappingURL=stay.controller.cjs.map
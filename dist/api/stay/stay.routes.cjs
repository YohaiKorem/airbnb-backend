"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { requireAuth, requireAdmin, requireOwnership, } = require('../../middlewares/requireAuth.middleware.cjs');
const { log } = require('../../middlewares/logger.middleware.cjs');
const { getStays, getStayById, addStay, updateStay, removeStay, getAllHostStaysById, getHostById, } = require('./stay.controller.cjs');
const router = express.Router();
// middleware that is specific to this router
// router.use(requireAuth)
router.get('/', log, getStays);
router.get('/:id', getStayById);
router.get('/host/:id', getHostById);
router.get('/host/stays/:id', getAllHostStaysById);
router.post('/', addStay);
router.put('/:id', requireAuth, requireOwnership, updateStay);
router.delete('/:id', requireAuth, requireOwnership, removeStay);
module.exports = router;
//# sourceMappingURL=stay.routes.cjs.map
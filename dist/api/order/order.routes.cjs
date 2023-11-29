"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { requireAuth, requireAdmin, requireOwnership, } = require('../../middlewares/requireAuth.middleware.cjs');
const { log } = require('../../middlewares/logger.middleware.cjs');
const { addOrder, updateOrder, getOrders, deleteOrder, getOrderById, } = require('./order.controller.cjs');
const router = express.Router();
// middleware that is specific to this router
// router.use(requireAuth)
router.get('/:id', log, requireAuth, getOrderById);
router.get('/orders/:id', log, requireAuth, getOrders);
router.get('/orders/host/:id', log, requireAuth, getOrders);
router.get('/orders/buyer/:id', log, requireAuth, getOrders);
router.post('/', log, requireAuth, addOrder);
router.put('/:id', log, requireAuth, requireOwnership, updateOrder);
router.delete('/:id', requireAuth, deleteOrder);
module.exports = router;
//# sourceMappingURL=order.routes.cjs.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { requireAuth, requireAdmin, } = require('../../middlewares/requireAuth.middleware.cjs');
const { log } = require('../../middlewares/logger.middleware.cjs');
const { addOrder, updateOrder, getOrders, deleteOrder, getOrderById, } = require('./order.controller.cjs');
const router = express.Router();
// middleware that is specific to this router
// router.use(requireAuth)
router.get('/:id', log, getOrderById);
router.get('/orders/:id', log, getOrders);
router.get('/orders/host/:id', log, getOrders);
router.get('/orders/buyer/:id', log, getOrders);
router.post('/', log, requireAuth, addOrder);
router.put('/:id', log, updateOrder);
router.delete('/:id', requireAuth, deleteOrder);
module.exports = router;
//# sourceMappingURL=order.routes.cjs.map
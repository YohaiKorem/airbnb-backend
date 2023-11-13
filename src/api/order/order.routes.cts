const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware.cjs')
const { log } = require('../../middlewares/logger.middleware.cjs')
const { addOrder, getOrders, deleteOrder } = require('./order.controller.cjs')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.post('/', log, requireAuth, addOrder)
router.delete('/:id', requireAuth, deleteOrder)

module.exports = router

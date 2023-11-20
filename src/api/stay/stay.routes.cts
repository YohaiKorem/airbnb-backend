const express = require('express')
const {
  requireAuth,
  requireAdmin,
} = require('../../middlewares/requireAuth.middleware.cjs')
const { log } = require('../../middlewares/logger.middleware.cjs')
const {
  getStayMsgs,
  getStays,
  getStayById,
  addStay,
  updateStay,
  removeStay,
  addStayMsg,
  removeStayMsg,
  updateStayMsg,
  getAllHostStaysById,
} = require('./stay.controller.cjs')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStays)
router.get('/:id', getStayById)
router.get('/host/stays/:id', getAllHostStaysById)
router.post('/', addStay)
router.put('/:id', updateStay)
router.delete('/:id', removeStay)
// router.delete('/:id', requireAuth, requireAdmin, removeStay)
router.get('/:id/msg', getStayMsgs)
router.post('/:id/msg', addStayMsg)
router.put('/:id/msg/:msgId', updateStayMsg)
router.delete('/:id/msg/:msgId', removeStayMsg)

module.exports = router

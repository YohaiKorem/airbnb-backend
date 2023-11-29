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
  getHostById,
} = require('./stay.controller.cjs')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getStays)
router.get('/:id', getStayById)
router.get('/host/:id', getHostById)
router.get('/host/stays/:id', getAllHostStaysById)
router.post('/', addStay)
router.put('/:id', updateStay)
router.delete('/:id', removeStay)

module.exports = router

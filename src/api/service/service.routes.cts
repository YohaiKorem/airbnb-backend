const express = require('express')
const { getLatLng } = require('./service.controller.cjs')
const router = express.Router()
router.get('/latlng', getLatLng)
module.exports = router

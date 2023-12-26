const axios = require('axios')
import dotenv from 'dotenv'
dotenv.config()
import { loggerService } from '../../services/logger.service.cjs'

async function getLatLng(req, res): Promise<any> {
  const { place } = req.body
  //   console.log('place', place)
  console.log(req, 'req')

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${'porto, portugal'}&key=${
    process.env.GEOCODE_API
  }`
  console.log('url', url)

  try {
    const result = await axios.get(url)
    // loggerService.debug('result', result.data.results[0].geometry.location)
    console.log(result)

    // res.json(result.data.results[0].geometry.location)
  } catch (err) {
    loggerService.error('Failed to get latlng', err)
    res.status(500).send({ err: 'Failed to get latlng' })
  }
}
module.exports = { getLatLng }

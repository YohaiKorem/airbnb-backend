const stayService = require('./stay.service.cjs')

import { loggerService } from '../../services/logger.service.cjs'
import {
  Pagination,
  SearchParam,
  Stay,
  StayFilter,
} from '../../models/stay.model.cjs'
import { StayHost } from '../../models/host.model.cjs'
async function getStays(req, res) {
  let {
    startDate,
    endDate,
    location,
    guests,
    minPrice,
    maxPrice,
    equipment,
    capacity,
    superhost,
    roomType,
    labels,
    amenities,
    pageIdx,
    pageSize,
  } = _parseQuery(req.query)

  const search: SearchParam = { startDate, endDate, location, guests }
  const filter: StayFilter = {
    labels,
    minPrice,
    maxPrice,
    equipment,
    capacity,
    roomType,
    amenities,
    superhost,
  }
  const pagination: Pagination = {
    pageIdx,
    pageSize,
  }
  try {
    loggerService.debug('Getting Stays')

    const stays: Stay[] = await stayService.query({
      filter,
      search,
      pagination,
    })

    res.json(stays)
  } catch (err) {
    loggerService.error('Failed to get stays', err)
    res.status(500).send({
      err: `Failed to get stays for filter ${req.query.filter} and search ${req.query.search}`,
    })
  }
}

async function getStayById(req, res) {
  try {
    const stayId: string = req.params.id
    const stay: Stay = await stayService.getById(stayId)
    res.json(stay)
  } catch (err) {
    loggerService.error('Failed to get stay', err)
    res.status(500).send({ err: 'Failed to get stay' })
  }
}

async function getAllHostStaysById(req, res) {
  const hostId: string = req.params.id
  try {
    const stays: Stay[] = await stayService.getAllHostStaysById(hostId)
    res.json(stays)
  } catch (err) {
    loggerService.error('Failed to get stays', err)
    res
      .status(500)
      .send({ err: `Failed to get stays for host with id ${hostId}` })
  }
}
async function getHostById(req, res) {
  const hostId: string = req.params.id
  try {
    const host: StayHost | null = await stayService.getHostById(hostId)
    res.json(host)
  } catch (err) {
    loggerService.error('Failed to get host', err)
    res.status(500).send({ err: `Failed to get host with id ${hostId}` })
  }
}

async function getStayMsgs(req, res) {
  console.log(req)
}

async function addStay(req, res) {
  const { loggedinUser } = req

  try {
    const stay = req.body
    const addedStay = await stayService.add(stay)
    res.json(addedStay)
  } catch (err) {
    loggerService.error('Failed to add stay', err)
    res.status(500).send({ err: 'Failed to add stay' })
  }
}

async function updateStay(req, res) {
  try {
    const stay = req.body
    console.log('stay in stay controller update', stay)

    const updatedStay = await stayService.update(stay)
    return res.json(updatedStay)
  } catch (err) {
    loggerService.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })
  }
}

async function removeStay(req, res) {
  try {
    const stayId = req.params.id
    console.log('stayId inside removeStay', stayId)

    await stayService.remove(stayId)
    res.json(stayId)
  } catch (err) {
    loggerService.error('Failed to remove stay', err)
    res.status(500).send({ err: 'Failed to remove stay' })
  }
}

async function updateStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const { msgId } = req.params
    const msg = {
      id: msgId,
      txt: req.body.txt,
      by: loggedinUser,
    }
    const updatedMsg = await stayService.updateStayMsg(msg, stayId)
    return res.json(updatedMsg)
  } catch (err) {
    console.log(err, 'cannot update stay message right now')
  }
}
async function addStayMsg(req, res) {
  const { loggedinUser } = req
  try {
    const stayId = req.params.id
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    }
    const savedMsg = await stayService.addStayMsg(stayId, msg)
    res.json(savedMsg)
  } catch (err) {
    loggerService.error('Failed to update stay', err)
    res.status(500).send({ err: 'Failed to update stay' })
  }
}

async function removeStayMsg(req, res) {
  try {
    const stayId = req.params.id
    const { msgId } = req.params

    const removedId = await stayService.removeStayMsg(stayId, msgId)
    res.send(removedId)
  } catch (err) {
    loggerService.error('Failed to remove stay msg', err)
    res.status(500).send({ err: 'Failed to remove stay msg' })
  }
}
function _parseQuery(query) {
  const res: any = {}
  for (let [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      try {
        res[key] = JSON.parse(value)
      } catch (error) {
        res[key] = value
      }
    } else res[key] = value
  }

  return res
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
  getAllHostStaysById,
  getHostById,
}

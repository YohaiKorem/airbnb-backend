const loggerService = require('../services/logger.service.cjs')
const authService = require('../api/auth/auth.service.cjs')
const config = require('../config/index.cjs')
const stayService = require('../api/stay/stay.service.cjs')
const orderService = require('../api/order/order.service.cjs')
async function requireAuth(req, res, next) {
  // if (config.isGuestMode && !req?.cookies?.loginToken) {
  //   req.loggedInUser = {_id: '', fullname: 'Guest'}
  //   return next()
  // }
  console.log('req.cookies', req.cookies)

  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedInUser) return res.status(401).send('Not Authenticated')

  req.loggedInUser = loggedInUser
  next()
}

async function requireOwnership(req, res, next) {
  const userId = req.loggedInUser._id
  console.log(req)
  const { baseUrl } = req
  const entityId = req.params.id
  let entityType
  if (baseUrl === '/api/order') {
    entityType = 'order'
  } else if (baseUrl === '/api/stay') {
    entityType = 'stay'
  } else {
    return res.status(400).send({ error: 'Invalid entity type' })
  }
  console.log('entityType', entityType)

  await getResourceOwner(entityType, entityId, userId, res, next)

  // try {
  //   const stayId = req.params.id
  //   const stay = await stayService.getById(stayId)

  //   if (!stay) {
  //     return res.status(404).send('Stay not found')
  //   }
  //   console.log(req.loggedInUser)

  //   if (req.loggedInUser._id.toString() !== stay.host._id.toString()) {
  //     console.log('')

  //     return res.status(403).send('Not Authorized to perform this action')
  //   }

  //   next()
  // } catch (err) {
  //   res.status(500).send('Server error')
  // }
}
async function getResourceOwner(entityType, entityId, userId, res, next) {
  const service: any = require(`../api/${entityType}/${entityType}.service.cjs`)
  try {
    const entity = await service.getById(entityId)
    if (!entity) {
      return res.status(404).send(`${entityType} not found`)
    }
    if (
      (entityType === 'stay' &&
        userId.toString() !== entity.host._id.toString()) ||
      (entityType === 'order' && userId.toString() !== entity.hostId)
    )
      return res.status(403).send('Not Authorized to perform this action')
  } catch (err) {
    console.log(err)
    return res.status(500).send({ error: 'Server error' })
  }

  next()
}

async function requireAdmin(req, res, next) {
  if (!req?.cookies?.loginToken)
    return res.status(401).send('Not Authenticated')
  const loggedInUser = authService.validateToken(req.cookies.loginToken)
  if (!loggedInUser.isAdmin) {
    loggerService.warn(
      loggedInUser.fullname + 'attempted to perform admin action'
    )
    res.status(403).end('Not Authorized')
    return
  }
  next()
}

// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin,
  requireOwnership,
}

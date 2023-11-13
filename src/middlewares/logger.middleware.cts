import { loggerService } from '../services/logger.service.cjs'

async function log(req, res, next) {
  loggerService.info('Req was made')
  next()
}

module.exports = {
  log,
}

var config

if (process.env.NODE_ENV === 'production') {
  config = require('./prod.cjs')
} else {
  config = require('./dev.cjs')
  // config = require('./dev')
}

config.isGuestMode = true

module.exports = config
export default config

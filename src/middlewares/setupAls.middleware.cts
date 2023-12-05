const authService = require('../api/auth/auth.service.cjs')
const asyncLocalStorage = require('../services/als.service.cjs')

export async function setupAsyncLocalStorage(req, res, next) {
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    console.log('req.cookies', req.cookies)
    if (!req.cookies) return next()
    const loginToken = req.cookies.loginToken
    if (loginToken) {
      console.log('loginToken', loginToken)

      const loggedInUser = authService.validateToken(req.cookies.loginToken)
      if (loggedInUser) {
        const alsStore = asyncLocalStorage.getStore()
        alsStore.loggedInUser = loggedInUser
      }
    }
    next()
  })
}

module.exports = setupAsyncLocalStorage

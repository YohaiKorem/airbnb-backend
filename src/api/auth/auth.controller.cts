const authService = require('./auth.service.cjs')
import { loggerService } from '../../services/logger.service.cjs'

async function login(req, res) {
  const { username, password } = req.body

  try {
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)
    loggerService.info('User login: ', user)
    res.cookie('loginToken', loginToken)
    console.log(user)
    res.json(user)
  } catch (err) {
    loggerService.error('Failed to Login ' + err)
    res.status(401).send({ err: 'Failed to Login' })
  }
}

async function signup(req, res) {
  try {
    const { username, password, fullname, imgUrl } = req.body
    const account = await authService.signup(
      username,
      password,
      fullname,
      imgUrl
    )
    loggerService.debug(
      `auth.route - new account created: ` + JSON.stringify(account)
    )
    const user = await authService.login(username, password)
    const loginToken = authService.getLoginToken(user)
    loggerService.info('User login: ', user)
    res.cookie('loginToken', loginToken)

    res.json(user)
  } catch ({ name, message }) {
    loggerService.error('Failed to signup ' + name)
    console.log(name)
    res.status(500).send({ name: 'Failed to signup', msg: message })
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('loginToken')
    res.send({ msg: 'Logged out successfully' })
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' })
  }
}

async function socialLogin(req, res) {}

async function socialSignup(req, res) {
  const { id } = req.body
  console.log(req.body)
  console.log(id)
}

module.exports = {
  login,
  signup,
  logout,
  socialLogin,
  socialSignup,
}

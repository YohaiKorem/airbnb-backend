const axios = require('axios')
const authService = require('./auth.service.cjs')
const userService = require('../user/user.service.cjs')
const FacebookStrategy = require('passport-facebook').strategy
const passport = require('passport')
import config from '../../config/index.cjs'
import { loggerService } from '../../services/logger.service.cjs'
import dotenv from 'dotenv'
dotenv.config()
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

async function verifyToken(req, res) {
  const { authToken } = req.query

  const url = `https://graph.facebook.com/me?fields=id,name&access_token=${authToken}`

  try {
    const response = await axios.get(url)
    if (response && response.data) socialSignIn(response.data, req, res)
  } catch (err) {
    // Handle errors here (invalid token, network issues, etc.)
    console.log(err, 'had an error')

    res.status(500).send({ name: 'Failed to verify user', msg: err })
  }
}

async function socialSignIn(responseData, req, res) {
  const { id, name } = responseData
  console.log('user', name)
  let user
  try {
    user = await userService.getBySocialId(id)
    if (!user) user = await signupFromFacebook(req, res)
    if (!user) throw new Error('Failed to create user from Facebook data')
    const response = JSON.parse(req.query.response)
    // user.imgUrl = req.query.photoUrl

    user.imgUrl = response.picture.data.url
    console.log(user)
    const loginToken = authService.getLoginToken(user)
    loggerService.info('User login: ', user)
    res.cookie('loginToken', loginToken)
    res.json(user)
  } catch (err) {
    console.log('Error in socialSignIn:', err)
    res
      .status(500)
      .send({ error: 'Failed to process social sign-in', message: err.message })
  }
}

async function signupFromFacebook(req, res) {
  try {
    const user = await authService.signupFromFacebook(req.query)
    return user
  } catch ({ name, message }) {
    loggerService.error('Failed to signup with facebook ' + name)
    res.status(500).send({ name: 'Failed to signup', msg: message })
  }
}

async function errCallback(req, res) {
  console.log('err redirect')
}

module.exports = {
  login,
  signup,
  logout,
  errCallback,
  verifyToken,
}

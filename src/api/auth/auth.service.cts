const Cryptr = require('cryptr')
import { User } from '../../models/user.model.cjs'
const bcrypt = require('bcrypt')
const userService = require('../user/user.service.cjs')
import { loggerService } from '../../services/logger.service.cjs'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export async function login(username, password) {
  console.log('username of login:', username)
  console.log('password of login:', password)
  loggerService.debug(`auth.service - login with username: ${username}`)

  const user = await userService.getByUsername(username)
  if (!user) return Promise.reject('Invalid username or password')
  // TODO: un-comment for real login

  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid username or password')

  delete user.password
  return user
}

export async function signup(username, password, fullname, imgUrl = null) {
  const saltRounds = 10
  console.log('username', username)

  loggerService.debug(
    `auth.service - signup with username: ${username}, fullname: ${fullname}`
  )
  if (!username || !password || !fullname)
    return Promise.reject('fullname, username and password are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ username, password: hash, fullname, imgUrl })
}

export function getLoginToken(user) {
  const userInfo = {
    _id: user._id,
    fullname: user.fullname,
    isAdmin: user.isAdmin,
  }
  return cryptr.encrypt(JSON.stringify(userInfo))
}

async function authFacebook(accessToken, refreshToken, profile, cb) {
  try {
    const user = await userService.getById(profile.id)
    if (!user) console.log('adding new facebook user to DB')
    const newUser = User.fromFacebook(profile)
  } catch (error) {}
}

export function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken)
    const loggedinUser = JSON.parse(json)
    return loggedinUser
  } catch (err) {
    console.log('Invalid login token')
  }
  return null
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
  authFacebook,
}

const express = require('express')
const {
  login,
  signup,
  logout,
  socialLogin,
  errCallback,
  verifyToken,
} = require('./auth.controller.cjs')
const passport = require('passport')

const router = express.Router()

router.post('/login', login)
router.post('/signup', signup)
// router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook', verifyToken)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'auth/err/callback' }),
  socialLogin
)
// router.post('/social', socialLogin)
router.post('/logout', logout)
router.get('/err/callback', errCallback)
module.exports = router

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { login, signup, logout, errCallback, verifySocialToken, } = require('./auth.controller.cjs');
const passport = require('passport');
const router = express.Router();
router.post('/login', login);
router.post('/signup', signup);
router.get('/facebook', verifySocialToken);
router.get('/google', verifySocialToken);
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { failureRedirect: 'auth/err/callback' }),
//   socialLogin
// )
// router.post('/social', socialLogin)
router.post('/logout', logout);
router.get('/err/callback', errCallback);
module.exports = router;
//# sourceMappingURL=auth.routes.cjs.map
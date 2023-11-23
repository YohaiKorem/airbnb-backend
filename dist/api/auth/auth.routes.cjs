"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { login, signup, logout, socialLogin, socialSignup, } = require('./auth.controller.cjs');
const router = express.Router();
router.post('/login', login);
router.post('/signup', signup);
router.post('/login/social', socialLogin);
router.post('/signup/social', socialSignup);
router.post('/logout', logout);
module.exports = router;
//# sourceMappingURL=auth.routes.cjs.map
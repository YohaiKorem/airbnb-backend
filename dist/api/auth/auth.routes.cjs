"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { login, signup, logout } = require('./auth.controller.cjs');
const router = express.Router();
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
module.exports = router;
//# sourceMappingURL=auth.routes.cjs.map
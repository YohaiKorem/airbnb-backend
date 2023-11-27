"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios');
const authService = require('./auth.service.cjs');
const userService = require('../user/user.service.cjs');
const FacebookStrategy = require('passport-facebook').strategy;
const passport = require('passport');
const index_cjs_1 = __importDefault(require("../../config/index.cjs"));
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await authService.login(username, password);
        const loginToken = authService.getLoginToken(user);
        logger_service_cjs_1.loggerService.info('User login: ', user);
        res.cookie('loginToken', loginToken);
        console.log(user);
        res.json(user);
    }
    catch (err) {
        logger_service_cjs_1.loggerService.error('Failed to Login ' + err);
        res.status(401).send({ err: 'Failed to Login' });
    }
}
async function signup(req, res) {
    try {
        const { username, password, fullname, imgUrl } = req.body;
        const account = await authService.signup(username, password, fullname, imgUrl);
        logger_service_cjs_1.loggerService.debug(`auth.route - new account created: ` + JSON.stringify(account));
        const user = await authService.login(username, password);
        const loginToken = authService.getLoginToken(user);
        logger_service_cjs_1.loggerService.info('User login: ', user);
        res.cookie('loginToken', loginToken);
        res.json(user);
    }
    catch ({ name, message }) {
        logger_service_cjs_1.loggerService.error('Failed to signup ' + name);
        console.log(name);
        res.status(500).send({ name: 'Failed to signup', msg: message });
    }
}
async function logout(req, res) {
    try {
        res.clearCookie('loginToken');
        res.send({ msg: 'Logged out successfully' });
    }
    catch (err) {
        res.status(500).send({ err: 'Failed to logout' });
    }
}
async function socialLogin(req, res) {
    const { provider } = req.body;
    console.log(req.body);
    console.log(provider);
}
async function authenticateFacebook(accessToken, refreshToken, profile, cb) {
    const user = await userService.getById(profile.id);
    if (!user)
        console.log('adding new facebook user to DB');
}
async function verifyToken(req, res) {
    const { authToken, email, firstName, id, lastName, name, photoUrl, provider, response, } = req.query;
    const appAccessToken = index_cjs_1.default['FACEBOOK_CLIENT_ID']; // You get this from your Facebook App settings
    const url = `https://graph.facebook.com/debug_token?input_token=${JSON.stringify(authToken)}&access_token=${appAccessToken}`;
    console.log('url', url);
    try {
        const response = await axios.get(url);
        console.log(response.data);
        return response.data; // This contains the verification result
    }
    catch (err) {
        // Handle errors here (invalid token, network issues, etc.)
        res.status(500).send({ name: 'Failed to verify user', msg: err });
    }
}
async function errCallback(req, res) {
    console.log('err redirect');
}
module.exports = {
    login,
    signup,
    logout,
    socialLogin,
    errCallback,
    authenticateFacebook,
    verifyToken,
};
//# sourceMappingURL=auth.controller.cjs.map
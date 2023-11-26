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
    const url = `https://graph.facebook.com/debug_token?input_token=${'EAAJJt8433ZBkBO2GtT0aZByBsjVsmVQXJjGq8HLcPUE2Y7wZChxma4AS4SyYkFXmKJLrGnUACZClBT3cdutjHDVwpEO3dN8rwEHfIjHt8Ej9f2urdsEUMZCh9sJn0ZAXayTY4ZAZCHWZA8ReBa0g9aUPscB6Ikup7cLI1qJcSUlpFbuXbYV98CGzlR6YGFWvb4XwJMeZBdIwgm67F82jORe0gkWj4GZAmPOpWMSZCJZB3xFZBVmEo7ewFGiEoRmbZAfs2MXpa4ZD'}&access_token=${appAccessToken}`;
    console.log('url', url);
    try {
        const response = await axios.get(url);
        console.log('response.data', response.data);
        return response.data; // This contains the verification result
    }
    catch (err) {
        console.log('Error message:', err.message);
        if (err.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('Error response data:', err.response.data);
            console.log('Error response status:', err.response.status);
            console.log('Error response headers:', err.response.headers);
        }
        else if (err.request) {
            // The request was made but no response was received
            console.log('Error request:', err.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', err.message);
        }
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
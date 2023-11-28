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
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
async function verifySocialToken(req, res) {
    let url;
    const { provider } = req.query;
    // provider === 'FACEBOOK'
    //   ? verifyFacebookToken(req, res)
    //   : verifyGoogleToken(req, res)
    const method = provider === 'FACEBOOK'
        ? async () => axios.get(`https://graph.facebook.com/me?fields=id,name&access_token=${req.query.authToken}`)
        : async () => axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${req.query.idToken}`);
    try {
        const response = await method();
        if (response && response.data)
            socialSignIn(response.data, req, res);
    }
    catch (err) {
        console.log(err, `had an error verifying from ${provider}`);
        res.status(500).send({ name: 'Failed to verify user', msg: err });
    }
}
async function verifyFacebookToken(req, res) {
    const { authToken } = req.query;
    const url = `https://graph.facebook.com/me?fields=id,name&access_token=${authToken}`;
    try {
        const response = await axios.get(url);
        if (response && response.data)
            socialSignIn(response.data, req, res);
    }
    catch (err) {
        console.log(err, 'had an error verifying from facebook');
        res.status(500).send({ name: 'Failed to verify user', msg: err });
    }
}
async function verifyGoogleToken(req, res) {
    console.log(req.query);
    const { idToken } = req.query;
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`;
    try {
        const response = await axios.post(url);
        if (response && response.data)
            socialSignIn(response.data, req, res);
    }
    catch (err) {
        console.log(err, 'had an error verifying from google');
        res.status(500).send({ name: 'Failed to verify user', msg: err });
    }
}
async function socialSignIn(responseData, req, res) {
    const { name } = responseData;
    const { provider, id } = req.query;
    let user;
    try {
        user = await userService.getBySocialId(id);
        if (!user)
            user = await signupFromSocial(req, res);
        if (!user)
            throw new Error(`Failed to create user from ${provider} data`);
        if (provider === 'FACEBOOK') {
            const response = JSON.parse(req.query.response);
            user.imgUrl = response.picture.data.url;
        }
        else
            user.imgUrl = req.query.photoUrl;
        const loginToken = authService.getLoginToken(user);
        logger_service_cjs_1.loggerService.info('User login: ', user);
        res.cookie('loginToken', loginToken);
        res.json(user);
    }
    catch (err) {
        console.log('Error in socialSignIn:', err);
        res
            .status(500)
            .send({ error: 'Failed to process social sign-in', message: err.message });
    }
}
async function signupFromSocial(req, res) {
    try {
        const user = await authService.signupFromSocial(req.query);
        return user;
    }
    catch ({ name, message }) {
        logger_service_cjs_1.loggerService.error(`Failed to signup with ${req.query.provider} ${name}`);
        res.status(500).send({ name: 'Failed to signup', msg: message });
    }
}
async function errCallback(req, res) {
    console.log('err redirect');
}
module.exports = {
    login,
    signup,
    logout,
    errCallback,
    verifyFacebookToken,
    verifyGoogleToken,
    verifySocialToken,
};
//# sourceMappingURL=auth.controller.cjs.map
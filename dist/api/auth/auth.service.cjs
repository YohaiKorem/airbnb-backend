"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.getLoginToken = exports.signup = exports.login = void 0;
const Cryptr = require('cryptr');
const bcrypt = require('bcrypt');
const userService = require('../user/user.service.cjs');
const logger_service_cjs_1 = require("../../services/logger.service.cjs");
const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234');
async function login(username, password) {
    console.log('username of login:', username);
    console.log('password of login:', password);
    logger_service_cjs_1.loggerService.debug(`auth.service - login with username: ${username}`);
    const user = await userService.getByUsername(username);
    if (!user)
        return Promise.reject('Invalid username or password');
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password);
    if (!match)
        return Promise.reject('Invalid username or password');
    delete user.password;
    return user;
}
exports.login = login;
async function signup(username, password, fullname, imgUrl = null) {
    const saltRounds = 10;
    console.log('username', username);
    logger_service_cjs_1.loggerService.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`);
    if (!username || !password || !fullname)
        return Promise.reject('fullname, username and password are required!');
    const hash = await bcrypt.hash(password, saltRounds);
    return userService.add({ username, password: hash, fullname, imgUrl });
}
exports.signup = signup;
function getLoginToken(user) {
    const userInfo = {
        _id: user._id,
        fullname: user.fullname,
        isAdmin: user.isAdmin,
    };
    return cryptr.encrypt(JSON.stringify(userInfo));
}
exports.getLoginToken = getLoginToken;
async function signupFromFacebook(facebookUser) {
    facebookUser.response = JSON.parse(facebookUser.response);
    const user = await userService.addFromSocial(facebookUser);
    return user;
}
async function signupFromGoogle(googleUser) {
    return await userService.addFromSocial(googleUser);
}
async function signupFromSocial(socialUser) {
    console.log('socialUser in auth serivce');
    if (socialUser.provider === 'FACEBOOK')
        socialUser.response = JSON.parse(socialUser.response);
    return await userService.addFromSocial(socialUser);
}
function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken);
        const loggedinUser = JSON.parse(json);
        return loggedinUser;
    }
    catch (err) {
        console.log('Invalid login token');
    }
    return null;
}
exports.validateToken = validateToken;
module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken,
    signupFromFacebook,
    signupFromGoogle,
    signupFromSocial,
};
//# sourceMappingURL=auth.service.cjs.map
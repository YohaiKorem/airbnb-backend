"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionPassport = exports.initializePassport = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_model_cjs_1 = require("../models/user.model.cjs");
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require('../api/user/user.service.cjs'); // Adjust path as needed
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3030/api/auth/facebook/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        let user = await userService.getById(profile.id);
        if (!user) {
            user = user_model_cjs_1.User.fromFacebook(profile);
        }
        return await done(null, user);
    }
    catch (err) {
        return await done(err, null);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userService.getById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
exports.default = passport;
const initializePassport = () => passport.initialize();
exports.initializePassport = initializePassport;
const sessionPassport = () => passport.session();
exports.sessionPassport = sessionPassport;
//# sourceMappingURL=passport.service.cjs.map
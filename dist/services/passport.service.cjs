"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionPassport = exports.initializePassport = void 0;
const user_model_cjs_1 = require("../models/user.model.cjs");
const index_cjs_1 = __importDefault(require("../config/index.cjs"));
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const userService = require('../api/user/user.service.cjs'); // Adjust path as needed
passport.use(new FacebookStrategy({
    clientID: index_cjs_1.default.FACEBOOK_CLIENT_ID,
    clientSecret: index_cjs_1.default.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:3030/api/auth/facebook/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile);
        let user = await userService.getById(profile.id);
        if (!user) {
            user = user_model_cjs_1.User.fromFacebook(profile);
        }
        done(null, user);
    }
    catch (err) {
        done(err, null);
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
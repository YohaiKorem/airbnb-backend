"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAsyncLocalStorage = void 0;
const authService = require('../api/auth/auth.service.cjs');
const asyncLocalStorage = require('../services/als.service.cjs');
async function setupAsyncLocalStorage(req, res, next) {
    const storage = {};
    asyncLocalStorage.run(storage, () => {
        if (!req.cookies)
            return next();
        const loginToken = req.cookies.loginToken;
        if (loginToken) {
            const loggedInUser = authService.validateToken(req.cookies.loginToken);
            if (loggedInUser) {
                const alsStore = asyncLocalStorage.getStore();
                alsStore.loggedInUser = loggedInUser;
            }
        }
        next();
    });
}
exports.setupAsyncLocalStorage = setupAsyncLocalStorage;
module.exports = setupAsyncLocalStorage;
//# sourceMappingURL=setupAls.middleware.cjs.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_cjs_1 = require("../services/logger.service.cjs");
async function log(req, res, next) {
    logger_service_cjs_1.loggerService.info('Req was made');
    next();
}
module.exports = {
    log,
};
//# sourceMappingURL=logger.middleware.cjs.map
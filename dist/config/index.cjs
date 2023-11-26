"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config;
if (process.env.NODE_ENV === 'production') {
    config = require('./prod.cjs');
}
else {
    config = require('./dev.cjs');
    // config = require('./dev')
}
config.isGuestMode = true;
module.exports = config;
exports.default = config;
//# sourceMappingURL=index.cjs.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
class Wishlist {
    name;
    stays;
    id;
    constructor(name, stays = [], id) {
        this.name = name;
        this.stays = stays;
        this.id = id;
        if (!id) {
            this.id = this._getRandomId();
        }
    }
    _getRandomId(length = 8) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
exports.Wishlist = Wishlist;
//# sourceMappingURL=wishlist.model.cjs.map
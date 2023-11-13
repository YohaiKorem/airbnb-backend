"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Buyer = void 0;
class Buyer {
    _id;
    fullname;
    imgUrl;
    constructor(_id, fullname, imgUrl) {
        this._id = _id;
        this.fullname = fullname;
        this.imgUrl = imgUrl;
    }
    static createBuyerFromUser(user) {
        return new Buyer(user._id, user.fullname, user.imgUrl);
    }
}
exports.Buyer = Buyer;
//# sourceMappingURL=buyer.model.cjs.map
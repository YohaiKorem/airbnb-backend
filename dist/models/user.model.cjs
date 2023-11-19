"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    fullname;
    imgUrl;
    password;
    username;
    wishlists;
    isOwner;
    _id;
    constructor(fullname, imgUrl, password, username, wishlists, isOwner, _id) {
        this.fullname = fullname;
        this.imgUrl = imgUrl;
        this.password = password;
        this.username = username;
        this.wishlists = wishlists;
        this.isOwner = isOwner;
        this._id = _id;
    }
}
exports.User = User;
//# sourceMappingURL=user.model.cjs.map
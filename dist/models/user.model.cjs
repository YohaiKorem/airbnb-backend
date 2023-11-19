"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    fullname;
    imgUrl;
    password;
    username;
    _id;
    wishlists;
    isOwner;
    constructor(fullname, imgUrl, password, username, _id, wishlists, isOwner) {
        this.fullname = fullname;
        this.imgUrl = imgUrl;
        this.password = password;
        this.username = username;
        this._id = _id;
        this.wishlists = wishlists;
        this.isOwner = isOwner;
    }
}
exports.User = User;
//# sourceMappingURL=user.model.cjs.map
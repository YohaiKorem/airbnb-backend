"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongodb_1 = require("mongodb");
class User {
    fullname;
    imgUrl;
    username;
    wishlists;
    isOwner;
    password;
    _id;
    constructor(fullname, imgUrl, username, wishlists, isOwner, password, _id) {
        this.fullname = fullname;
        this.imgUrl = imgUrl;
        this.username = username;
        this.wishlists = wishlists;
        this.isOwner = isOwner;
        this.password = password;
        this._id = _id;
    }
    static fromFacebook(facebookUser) {
        return new User(facebookUser.name, facebookUser.response.picture.data.url, facebookUser.firstName, [], false, facebookUser.authToken, new mongodb_1.ObjectId(facebookUser.id));
    }
    static fromGoogle(googleUser) {
        return new User(googleUser.name, googleUser.photoUrl, googleUser.firstName, [], false, googleUser.idToken, googleUser.id);
    }
}
exports.User = User;
//# sourceMappingURL=user.model.cjs.map
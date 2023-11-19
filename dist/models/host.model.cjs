"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StayHost = void 0;
class StayHost {
    _id;
    fullname;
    location;
    responseTime;
    thumbnailUrl;
    pictureUrl;
    isSuperhost;
    description;
    constructor(_id, fullname, location, responseTime, thumbnailUrl, pictureUrl, isSuperhost, description) {
        this._id = _id;
        this.fullname = fullname;
        this.location = location;
        this.responseTime = responseTime;
        this.thumbnailUrl = thumbnailUrl;
        this.pictureUrl = pictureUrl;
        this.isSuperhost = isSuperhost;
        this.description = description;
    }
    static newHostFromUser(user) {
        return new StayHost(user._id, user.fullname, '', '', user.imgUrl, user.imgUrl, false, '');
    }
}
exports.StayHost = StayHost;
//# sourceMappingURL=host.model.cjs.map
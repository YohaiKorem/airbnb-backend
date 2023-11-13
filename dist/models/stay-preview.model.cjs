"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StayPreview = void 0;
class StayPreview {
    _id;
    name;
    thumbnail;
    constructor(stay) {
        this._id = stay._id;
        this.name = stay.name;
        this.thumbnail = stay.imgUrls[0];
    }
}
exports.StayPreview = StayPreview;
//# sourceMappingURL=stay-preview.model.cjs.map
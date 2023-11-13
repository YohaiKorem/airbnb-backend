"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Msg = void 0;
class Msg {
    id;
    txt;
    fromId;
    toId;
    sentTimeStamp;
    constructor(id, txt, fromId, toId, sentTimeStamp) {
        this.id = id;
        this.txt = txt;
        this.fromId = fromId;
        this.toId = toId;
        this.sentTimeStamp = sentTimeStamp;
    }
}
exports.Msg = Msg;
//# sourceMappingURL=msg.model.cjs.map
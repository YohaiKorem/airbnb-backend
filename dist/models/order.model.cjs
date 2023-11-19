"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const buyer_model_cjs_1 = require("./buyer.model.cjs");
class Order {
    _id;
    hostId;
    buyer;
    totalPrice;
    checkin;
    checkout;
    guests;
    stay;
    msgs;
    status;
    constructor(_id, hostId, buyer, totalPrice, checkin, checkout, guests, stay, msgs, status) {
        this._id = _id;
        this.hostId = hostId;
        this.buyer = buyer;
        this.totalPrice = totalPrice;
        this.checkin = checkin;
        this.checkout = checkout;
        this.guests = guests;
        this.stay = stay;
        this.msgs = msgs;
        this.status = status;
    }
    static createOrderFromInput(user, stay, searchParam) {
        const stayForOrder = {
            _id: stay._id,
            name: stay.name,
            price: stay.price,
            address: stay.loc.city,
        };
        const buyer = buyer_model_cjs_1.Buyer.createBuyerFromUser(user);
        const timeDifference = searchParam.endDate.getTime() - searchParam.startDate.getTime();
        const totalPrice = Math.ceil(timeDifference / (1000 * 3600 * 24)) * stay.price;
        return new Order('', stay.host._id, buyer, totalPrice, Date.parse(searchParam.startDate.toDateString()), Date.parse(searchParam.endDate.toDateString()), searchParam.guests, stayForOrder, [], 'pending');
    }
}
exports.Order = Order;
//# sourceMappingURL=order.model.cjs.map
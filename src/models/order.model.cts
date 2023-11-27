import { ObjectId } from 'mongodb'
import { Buyer } from './buyer.model.cjs'
import { Msg } from './msg.model.cjs'
import { SearchParam, Stay } from './stay.model.cjs'
import { User } from './user.model.cjs'

export class Order {
  constructor(
    public _id: string | ObjectId,
    public hostId: string | ObjectId,
    public buyer: Buyer,
    public totalPrice: number,
    public checkin: number,
    public checkout: number,
    public guests: {
      adults: number
      children: number
      infants: number
    },
    public stay: {
      _id: string
      name: string
      price: number
      address: string
    },
    public msgs: Msg[],
    public status: string
  ) {}
  static createOrderFromInput(
    user: User,
    stay: Stay,
    searchParam: SearchParam
  ) {
    const stayForOrder = {
      _id: stay._id,
      name: stay.name,
      price: stay.price,
      address: stay.loc.city,
    }
    const buyer: Buyer = Buyer.createBuyerFromUser(user)

    const timeDifference =
      searchParam.endDate!.getTime() - searchParam.startDate!.getTime()
    const totalPrice =
      Math.ceil(timeDifference / (1000 * 3600 * 24)) * stay.price

    return new Order(
      '',
      stay.host._id,
      buyer,
      totalPrice,
      Date.parse(searchParam.startDate!.toDateString()),
      Date.parse(searchParam.endDate!.toDateString()),
      searchParam.guests,
      stayForOrder,
      [],
      'pending'
    )
  }
}

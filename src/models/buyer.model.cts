import { ObjectId } from 'mongodb'
import { User } from './user.model.cjs'

export class Buyer {
  constructor(
    public _id: string | ObjectId,
    public fullname: string,
    public imgUrl: string
  ) {}
  static createBuyerFromUser(user: User) {
    return new Buyer(user._id, user.fullname, user.imgUrl)
  }
}

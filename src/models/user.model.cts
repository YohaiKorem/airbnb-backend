import { Wishlist } from './wishlist.model.cjs'
export class User {
  constructor(
    public fullname: string,
    public imgUrl: string,
    public password: string,
    public username: string,
    public _id: string,
    public wishlists: Wishlist[],
    public isOwner: boolean
  ) {}
}

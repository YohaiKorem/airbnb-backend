import { Wishlist } from './wishlist.model.cjs'
export class User {
  constructor(
    public fullname: string,
    public imgUrl: string,
    public password: string,
    public username: string,
    public wishlists: Wishlist[],
    public isOwner: boolean,
    public _id?: string
  ) {}
}

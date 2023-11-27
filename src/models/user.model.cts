import { ObjectId } from 'mongodb'
import { Wishlist } from './wishlist.model.cjs'
export class User {
  constructor(
    public fullname: string,
    public imgUrl: string,
    public username: string,
    public wishlists: Wishlist[],
    public isOwner: boolean,
    public password?: string,
    public _id?: string | ObjectId
  ) {}
  public static fromFacebook(facebookUser): User {
    return new User(
      facebookUser.name,
      facebookUser.response.picture.data.url,
      facebookUser.firstName,
      [],
      false,
      facebookUser.authToken,
      new ObjectId(facebookUser.id)
    )
  }
  public static fromGoogle(googleUser): User {
    return new User(
      googleUser.name,
      googleUser.photoUrl,
      googleUser.firstName,
      [],
      false,
      googleUser.idToken,
      googleUser.id
    )
  }
}

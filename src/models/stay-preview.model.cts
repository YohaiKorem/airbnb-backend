import { Stay } from './stay.model.cjs'

export class StayPreview {
  _id: string
  name: string
  thumbnail: string

  constructor(stay: Stay) {
    this._id = stay._id
    this.name = stay.name
    this.thumbnail = stay.imgUrls[0]
  }
}

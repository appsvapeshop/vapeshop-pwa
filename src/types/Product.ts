import { Timestamp } from 'firebase/firestore'

export type Product = {
  id: string
  img: string
  brand: string
  name: string
  variants?: string[]
  coupon: boolean
  newspaper: boolean
  points?: number
  price?: number
  promoPrice?: number
  mixedPrice?: number
  category: string
  createDate?: Timestamp
  updateDate?: Timestamp
}

import { FieldValue } from 'firebase/firestore'

export type Product = {
  id: string
  img: string
  brand: string
  name: string
  coupon: boolean
  newspaper: boolean
  points?: number
  price?: number
  promoPrice?: number
  mixedPrice?: number
  createDate: FieldValue
  category: string
  timestamp?: number
}

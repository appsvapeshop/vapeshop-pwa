import { Timestamp } from 'firebase/firestore'
import { ProductVariant } from './ProductVariant'

export type Product = {
  id: string
  img: string
  brand: string
  name: string
  variant?: string
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

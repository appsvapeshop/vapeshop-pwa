import { Timestamp } from 'firebase/firestore'

export type ProductVariant = {
  id: string
  name: string
  createDate?: Timestamp
  updateDate?: Timestamp
}

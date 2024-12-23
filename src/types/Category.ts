import { Timestamp } from 'firebase/firestore'

export type Category = {
  id: string
  name: string
  img: string
  createDate?: Timestamp
  updateDate?: Timestamp
}

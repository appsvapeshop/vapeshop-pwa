import { Timestamp } from 'firebase/firestore'

export type News = {
  id: string
  img: string
  title: string
  createDate?: Timestamp
  updateDate?: Timestamp
}

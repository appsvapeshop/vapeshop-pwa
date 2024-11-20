import { FieldValue } from 'firebase/firestore'

export type News = {
  id: string
  img: string
  title: string
  content: string
  createDate: FieldValue
}

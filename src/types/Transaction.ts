import { Product } from '../types/Product'
import { Timestamp } from 'firebase/firestore'
import { TransactionMode } from '../enums/TransactionMode'

export type Transaction = {
  id?: string
  mode: TransactionMode
  userId: string
  timestamp: Timestamp
  points: number
  price: number
  products?: Product[]
}

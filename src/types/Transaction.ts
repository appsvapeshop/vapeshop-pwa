import { Product } from './Product'
import { Timestamp } from 'firebase/firestore'
import { TransactionMode } from '../enums/TransactionMode'

/**
 * Customer Transaction Type
 */
export type Transaction = {
  /**
   * Transaction ID. May be null before finalization
   */
  id?: string

  /**
   * Customer ID related to transaction
   */
  customerId: string

  /**
   * Indicates whether it is a sale or exchange of points for a product
   */
  mode: TransactionMode

  /**
   * Points that have been allocated or that have been spent ( depends on transactionMode )
   */
  points: number

  /**
   * The amount the customer spent in the store
   */
  price: number

  /**
   * products that the customer exchanged for points. May be null if it is Sell mode
   */
  products?: Product[]

  /**
   * Transaction finalization date
   */
  transactionDate: Timestamp
}

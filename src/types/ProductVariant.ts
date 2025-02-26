import { Timestamp } from 'firebase/firestore'

/**
 * Product Variant type
 */
export type ProductVariant = {
  /**
   * Product Variant ID
   */
  id: string

  /**
   * Product Variant Name
   */
  name: string

  /**
   * Product Category create date
   */
  createDate: Timestamp

  /**
   * Product Category last update date
   */
  updateDate: Timestamp
}

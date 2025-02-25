import { Timestamp } from 'firebase/firestore'

/**
 * Product Category type
 */
export type ProductCategory = {
  /**
   * Product Category ID
   */
  id: string

  /**
   * Product Category name
   */
  name: string

  /**
   * Product Category image path ( URL )
   */
  img: string

  /**
   * Product Category create date
   */
  createDate: Timestamp

  /**
   * Product Category last update date
   */
  updateDate: Timestamp
}

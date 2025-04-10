import { Timestamp } from 'firebase/firestore'

/**
 * News type
 */
export type News = {
  /**
   * Product Category ID
   */
  id: string

  /**
   * Product Category image path ( URL )
   */
  img: string

  /**
   * News title ( not displayed )
   */
  title: string

  /**
   * Product Category create date
   */
  createDate: Timestamp

  /**
   * Product Category last update date
   */
  updateDate: Timestamp
}

import { Timestamp } from 'firebase/firestore'

/**
 * Shop Settings Type
 */
export type ShopSettings = {
  /**
   * Shop Settings ID. May be null before finalization
   */
  id: string

  /**
   * The amount for which one point is obtained
   */
  amountForOnePoint: number

  /**
   * Enable product categories for coupons. If true then product categories will be displayed in coupon tab
   */
  categoriesForCoupons: boolean

  /**
   * Enable product categories for newspaper. If true then product categories will be displayed in newspaper tab
   */
  categoriesForNewspaper: boolean

  /**
   * Shop Settings last update date
   */
  updateDate: Timestamp
}

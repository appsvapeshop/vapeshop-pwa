import { Timestamp } from 'firebase/firestore'

/**
 * Product type
 */
export type Product = {
  /**
   * Product Category ID
   */
  id: string

  /**
   * Product Category image path ( URL )
   */
  img: string

  /**
   * Product Brand
   */
  brand: string

  /**
   * Product Name
   */
  name: string

  /**
   * Product variant. Will override all properties if selected
   */
  variant: Product

  /**
   * Whether the product is a coupon ( will be displayed in coupons )
   */
  coupon: boolean

  /**
   * Is it a product from a newspaper ( will be displayed in newspaper )
   */
  newspaper: boolean

  /**
   * If the product is a coupon, this is the point cost of that product
   */
  points?: number

  /**
   * If it is a product from a newspaper, it is the price in a stationary store
   */
  price?: number

  /**
   * If it is a product from a newspaper, it is the discount price in a stationary store. May be null if product is
   * not discounted
   */
  promoPrice?: number

  /**
   * Amount if the coupon requires an additional fee upon exchange. May be null if product not requires
   * an additional fee upon exchange
   */
  mixedPrice?: number

  /**
   * Product Category ID
   */
  categoryId: string

  /**
   * Product Category create date
   */
  createDate: Timestamp

  /**
   * Product Category last update date
   */
  updateDate: Timestamp
}

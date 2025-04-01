import { Product as ProductType } from '../types/Product'

/**
 * Cart context type
 */
export type CartContext = {
  /**
   * All products in cart
   */
  products: ProductType[]

  /**
   * Method for adding product to the Cart Context
   */
  addProduct: (product: ProductType) => void

  /**
   * Method for remove product from the Cart Context
   */
  removeProduct: (product: ProductType) => void

  /**
   * Method increase quantity of the product in the Cart Context
   */
  increaseQuantity: (product: ProductType) => void

  /**
   * Method reduces quantity of the product in the Cart Context
   */
  reduceQuantity: (product: ProductType) => void

  /**
   * Remove all products from the Cart Context
   */
  clearCart: () => void
}

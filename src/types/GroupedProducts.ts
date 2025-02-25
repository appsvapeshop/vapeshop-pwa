import { Product as ProductType } from '../types/Product'

export type GroupedProducts = {
  [productId: string]: {
    [variantId: string]: {
      product: ProductType
      size: number
    }
  }
}

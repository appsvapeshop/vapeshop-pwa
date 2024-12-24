import { Product as ProductType } from '../types/Product'

export type GroupedProducts = {
  [productId: string]: {
    product: ProductType
    size: number
  }
}

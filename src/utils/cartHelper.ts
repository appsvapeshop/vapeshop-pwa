import { Product as ProductType } from '../types/Product'

export const sumPrice = (cart: Array<ProductType>): number => {
  return cart.reduce((sum, cartProduct) => sum + (cartProduct.mixedPrice || 0), 0)
}

export const sumPoints = (cart: Array<ProductType>): number => {
  return cart.reduce((sum, cartProduct) => sum + (cartProduct.points ?? 0), 0)
}

import { Product as ProductType } from '../types/Product'

/**
 * Group return map with a product Id as a key and another map with product variant as a key and product variant as a value.
 * If product doesn't have variant then assign product to variant.
 *
 * @param products that should be grouped. Must not be null.
 *
 * @return Map<productId, Map<variantId, variant>>
 */
export const groupProductsByIdAndVariants = (products: ProductType[]): any => {
  return products.reduce((accumulator, product) => {
    if (!accumulator[product.id]) {
      accumulator[product.id] = { [product.variant?.id!]: { product: product, size: 1 } }
    } else {
      const variants = accumulator[product.id]
      if (variants[product.variant!.id]) {
        variants[product.variant!.id].size += 1
      } else {
        variants[product.variant!.id] = { product: product, size: 1 }
      }
    }

    return accumulator
  }, Object.assign({}))
}

/**
 * Get all saved cart products from local storage.
 *
 * @return all cart products from local storage
 */
export const getSavedProducts = () => {
  return JSON.parse(localStorage.getItem('cartProducts') as string) || []
}

/**
 * Get total price for given products
 */
export const sumPrice = (products: ProductType[]): number => {
  return products.reduce((sum, product) => sum + (product.mixedPrice || 0), 0)
}

/**
 * Get total points for given products
 */
export const sumPoints = (products: ProductType[]): number => {
  return products.reduce((sum, product) => sum + (product.points ?? 0), 0)
}

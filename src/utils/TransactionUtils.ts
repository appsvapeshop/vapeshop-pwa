import { sumPoints, sumPrice } from './ProductUtils'

import { QrData } from '../types/QrData'
import UserNotFound from '../exceptions/UserNotFound'
import { Product as ProductType } from '../types/Product'
import CartCannotBeEmpty from '../exceptions/CartCannotBeEmpty'
import ProductsAreMissingInDatabase from '../exceptions/ProductsAreMissingInDatabase'

/**
 * Check if amount and points from QR are equal to points and amount from database for this same products.
 *
 * @param databaseProducts products queried from database. Must not be null.
 * @param qrData data retrieved from client QR. Must not be null.
 *
 * @return true if points and amount are the same, in other cases return false
 */
export const isAmountsValid = (databaseProducts: Array<ProductType>, qrData: QrData): boolean => {
  const databaseAmount = sumPrice(databaseProducts)
  const databasePointsAmount = sumPoints(databaseProducts)
  return databaseAmount === qrData.cartAmount && databasePointsAmount === qrData.pointAmount
}

/**
 * Method prepare list of products prepared from QR and product records retrieved from database.
 * If Product quantity in QR is grater than 1 then in product list this product will be duplicated.
 *
 * @param retrievedProducts products with assigned variants retrieved from database. Must not be null.
 * @param qrData data from scanned QR. Must not be null.
 *
 * @return list of products scanned from QR.
 */
export const getProductListFromQr = (retrievedProducts: any, qrData: QrData): ProductType[] => {
  const databaseProducts: ProductType[] = []

  retrievedProducts.forEach((retrievedProduct: any) => {
    if (!retrievedProduct.variants || retrievedProduct.variants.length === 0) {
      // @ts-ignore
      const productQuantity = qrData.productsSummary![retrievedProduct.id][retrievedProduct.id] || 0
      for (let i: number = 1; i <= productQuantity; i++) {
        databaseProducts.push(retrievedProduct)
      }
    } else {
      retrievedProduct.variants.forEach((variant: any) => {
        // @ts-ignore
        const productQuantity = qrData.productsSummary![retrievedProduct.id][variant.id] || 0
        for (let i: number = 1; i <= productQuantity; i++) {
          databaseProducts.push({ ...retrievedProduct, variant: variant })
        }
      })
    }
  })

  return databaseProducts
}

/**
 * Check if scanned QR has valid data.
 *
 * @param qrData data from scanned QR. Must not be null.
 */
export const validateQr = (qrData: QrData) => {
  if (!qrData.productsSummary) throw new CartCannotBeEmpty()
  if (!qrData.userId) throw new UserNotFound()
}

/**
 * Check if all scanned products from QR exists in database
 *
 * @param qrData . Must not be null.
 * @param retrievedProducts . Must not be null.
 */
export const validateProductsWithDatabase = (qrData: QrData, retrievedProducts: ProductType[]) => {
  if (retrievedProducts.length === 0 || Object.keys(qrData.productsSummary!).length !== retrievedProducts.length)
    throw new ProductsAreMissingInDatabase()
}

import QRCode from 'qrcode'
import { QrData } from '../types/QrData'
import { QrContext } from '../enums/QrContext'
import { User as UserType } from '../types/User'
import { sumPoints, sumPrice } from './ProductUtils'
import { Product as ProductType } from '../types/Product'

/**
 * Generate QR data for cart. Generated QR contains information about:
 * <ul>
 *   <li>QR Context.</li>
 *   <li>User Id.</li>
 *   <li>All products in cart (in following format productId => variantId => quantity).</li>
 *   <li>Total cart amount.</li>
 *   <li>Total cart points.</li>
 * </ul>
 *
 * @param user current user. Must not be null.
 * @param cartProducts. Must not be null.
 *
 * @return QR data URL which contains all required data
 */
export const generateCartQR = async (user: UserType, cartProducts: ProductType[]) => {
  const productSummary = cartProducts.reduce((accumulator, product) => {
    if (!accumulator[product.id]) {
      accumulator[product.id] = { [product.variant?.id || product.id]: 1 }
    } else {
      const variants = accumulator[product.id]
      if (variants[product.variant!.id]) {
        variants[product.variant!.id] += 1
      } else {
        variants[product.variant!.id] = 1
      }
    }

    return accumulator
  }, Object.assign({}))

  const qrData: QrData = {
    qrContext: QrContext.FinalizeCart,
    userId: user.id,
    productsSummary: productSummary,
    cartAmount: sumPrice(cartProducts),
    pointAmount: sumPoints(cartProducts)
  }

  return await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'low',
    color: { light: '#0000' },
    width: 300
  })
}

/**
 * Generate QR data for user card. Generated QR contains information about:
 * <ul>
 *   <li>QR Context.</li>
 *   <li>User Id.</li>
 * </ul>
 *
 * @param user current user. Must not be null.
 *
 * @return QR data URL which contains all required data
 */
export const generateUserQR = async ({ id }: { id: string }): Promise<string> => {
  const qrData: QrData = {
    qrContext: QrContext.UserCard,
    userId: id
  }

  return await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'low',
    color: { light: '#0000' },
    width: 300
  })
}

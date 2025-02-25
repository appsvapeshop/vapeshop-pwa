import QRCode from 'qrcode'
import { QrData } from '../types/QrData'
import { QrContext } from '../enums/QrContext'
import { User as UserType } from '../types/User'
import { sumPoints, sumPrice } from './cartHelper'
import { Product as ProductType } from '../types/Product'

export const getCartQR = async (user: UserType, cartProducts: ProductType[]) => {
  const productSummary = cartProducts.reduce((accumulator, product) => {
    if (!accumulator[product.id]) {
      accumulator[product.id] = { [product.variant?.id || product.id]: 1 }
    } else {
      const variants = accumulator[product.id]
      if (variants[product.variant!.id]) {
        variants[product.variant!.id] += 1
      } else {
        variants[product.variant!.id] = 1;
      }
    }

    return accumulator
  }, Object.assign({}))

  const qrData: QrData = {
    mode: QrContext.FinalizeCart,
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

export const getUserQR = async ({ id }: { id: string }): Promise<string> => {
  const qrData: QrData = {
    mode: QrContext.UserCard,
    userId: id
  }
  return await QRCode.toDataURL(JSON.stringify(qrData), {
    errorCorrectionLevel: 'low',
    color: { light: '#0000' },
    width: 300
  })
}

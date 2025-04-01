import { QrContext } from '../enums/QrContext'

/**
 * Data stored in generated QR Code
 */
export type QrData = {
  /**
   * Context for which the qr code was generated
   */
  qrContext: QrContext

  /**
   * User ID for UserCard QR context. May be null if it is not UserCard QR context
   */
  userId?: string

  /**
   * Products summary for FinalizeCart QR context. Contains Product ID as a key and quantity as a value.
   * May be null if it is not FinalizeCart QR context
   */
  productsSummary?: Record<string, number>

  /**
   * Total amount from the Cart. May be null if it is not FinalizeCart QR context
   */
  cartAmount?: number

  /**
   * Total points amount from the Cart. May be null if it is not FinalizeCart QR context
   */
  pointAmount?: number
}

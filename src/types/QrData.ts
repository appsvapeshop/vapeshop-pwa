import { QrContext } from '../enums/QrContext'

export type QrData = {
  mode: QrContext
  productsSummary?: Record<string, number>
  cartAmount?: number
  pointAmount?: number
  userId?: string
}

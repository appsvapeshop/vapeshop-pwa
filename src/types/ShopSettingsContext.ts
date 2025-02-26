import { ShopSettings } from './ShopSettings'
import { FetchStatus } from '../enums/FetchStatus'

/**
 * Shop Settings context type
 */
export type ShopSettingsContext = {
  /**
   * All related shop settings
   */
  settings: ShopSettings

  /**
   * Shop settings fetch status ( indicates whether it is loaded or not )
   */
  fetchStatus: FetchStatus

  /**
   * Method update Shop Settings in database
   */
  updateSettings: (shopSettings: ShopSettings) => Promise<void>
}

import { ShopSettings } from '../types/ShopSettings'
import SettingsNotFound from '../exceptions/SettingsNotFound'

import { firestore } from '../configs/firebaseConfig'
import { collection, getDocs } from 'firebase/firestore'

/**
 * Get current Shop Settings
 */
export const getSettings = async (): Promise<ShopSettings> => {
  const settingsCollection = collection(firestore, 'settings')
  const settingsSnapshot = await getDocs(settingsCollection)

  if (settingsSnapshot.docs.length !== 1) throw new SettingsNotFound()

  return {
    id: settingsSnapshot.docs[0].id,
    ...settingsSnapshot.docs[0].data()
  } as ShopSettings
}

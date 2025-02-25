import { useUserContext } from './UserContext'
import { AuthStatus } from '../enums/AuthStatus'
import { firestore } from '../configs/firebaseConfig'
import { createContext, useState, useContext, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { ShopSettingsContext as SettingsContextType } from '../types/ShopSettingsContext'
import { FetchStatus } from '../enums/FetchStatus'
import {ShopSettings} from '../types/ShopSettings'

const SettingsContext = createContext<SettingsContextType | null>(null)

const SettingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useUserContext()
  const [settingsStatus, setSettingsStatus] = useState<FetchStatus>(FetchStatus.NotStarted)
  const [settings, setSettings] = useState<ShopSettings>()

  useEffect(() => {
    setSettingsStatus(FetchStatus.InProgress)

    if (authStatus === AuthStatus.Authorized) {
      getSettings()
    }
  }, [authStatus])

  const getSettings = async () => {
    const settingsCollection = collection(firestore, 'settings')
    const settingsSnapshot = await getDocs(settingsCollection)

    if (settingsSnapshot.docs.length !== 1) throw new Error('Wrong app settings size')

    setSettings({
      ...settingsSnapshot.docs[0].data(),
      id: settingsSnapshot.docs[0].id
    } as ShopSettings)
    setSettingsStatus(FetchStatus.Completed)
  }

  const updateSettings = async (updatedSettings: ShopSettings) => {
    await updateDoc(doc(firestore, 'settings', updatedSettings.id as string), {
      categoriesForCoupons: updatedSettings.categoriesForCoupons,
      categoriesForNewspaper: updatedSettings.categoriesForNewspaper,
      pointsPerAmount: updatedSettings.amountForOnePoint
    })
    setSettings(updatedSettings)
  }

  const contextValue: SettingsContextType = {
    settings: settings!,
    fetchStatus: settingsStatus,
    updateSettings: updateSettings
  }

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export default SettingsContextProvider

export const useSettingsContext = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider')
  }
  return context
}

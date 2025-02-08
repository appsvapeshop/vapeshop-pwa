import { useUserContext } from './UserContext'
import { AuthStatus } from '../types/UserContext'
import { firestore } from '../configs/firebaseConfig'
import { createContext, useState, useContext, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { SettingsContext as SettingsContextType, SettingStatus } from '../types/SettingsContext'

const SettingsContext = createContext<SettingsContextType | null>(null)

const SettingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useUserContext()
  const [settingsStatus, setSettingsStatus] = useState<SettingStatus>(SettingStatus.NotStarted)
  const [settings, setSettings] = useState<SettingsContextType>()

  useEffect(() => {
    setSettingsStatus(SettingStatus.InProgress)

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
      settingsId: settingsSnapshot.docs[0].id
    } as SettingsContextType)
    setSettingsStatus(SettingStatus.Completed)
  }

  const updateSettings = async (updatedSettings: SettingsContextType) => {
    await updateDoc(doc(firestore, 'settings', updatedSettings.settingsId as string), {
      categoriesForCoupons: updatedSettings.categoriesForCoupons,
      categoriesForNewspaper: updatedSettings.categoriesForNewspaper,
      pointsPerAmount: updatedSettings.pointsPerAmount
    })
    setSettings(updatedSettings)
  }

  const contextValue = {
    settingsId: settings?.settingsId,
    pointsPerAmount: settings?.pointsPerAmount,
    categoriesForCoupons: settings?.categoriesForCoupons,
    categoriesForNewspaper: settings?.categoriesForNewspaper,
    settingsStatus: settingsStatus,
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

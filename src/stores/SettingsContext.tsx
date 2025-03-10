import { AuthStatus } from '../enums/AuthStatus'
import { FetchStatus } from '../enums/FetchStatus'
import { ShopSettings } from '../types/ShopSettings'
import { ShopSettingsContext as SettingsContextType } from '../types/ShopSettingsContext'

import ErrorOccurred from '../exceptions/ErrorOccurred'

import { useUserContext } from './UserContext'
import { updateDoc, doc } from 'firebase/firestore'
import { firestore } from '../configs/firebaseConfig'
import { getSettings } from '../services/SettingsService'
import React, { createContext, useState, useContext, useEffect } from 'react'

/**
 * Shop Settings Context. Is null before initialization
 */
const SettingsContext = createContext<SettingsContextType | null>(null)

/**
 * Shop Settings Context Provider. Provides the currently shop setting and useful shop settings management functions
 */
const SettingsContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useUserContext()
  const [settings, setSettings] = useState<ShopSettings>()
  const [settingsStatus, setSettingsStatus] = useState<FetchStatus>(FetchStatus.NotStarted)

  /**
   * When current user is authorized then select shop settings
   */
  useEffect(() => {
    setSettingsStatus(FetchStatus.InProgress)

    if (authStatus === AuthStatus.Authorized) {
      getSettings()
        .then((settings) => {
          setSettings(settings)
          setSettingsStatus(FetchStatus.Completed)
        })
        .catch(() => {
          throw new ErrorOccurred()
        })
    }
  }, [authStatus])

  /**
   * Update Shop Settings for given data
   *
   * @param settings updates Shop Settings. Must not be null.
   */
  const updateSettings = async (settings: ShopSettings) => {
    if (!settings) throw new ErrorOccurred()

    await updateDoc(doc(firestore, 'settings', settings.id as string), {
      categoriesForCoupons: settings.categoriesForCoupons,
      categoriesForNewspaper: settings.categoriesForNewspaper,
      pointsPerAmount: settings.amountForOnePoint
    })

    setSettings(settings)
  }

  const contextValue: SettingsContextType = {
    settings: settings!,
    fetchStatus: settingsStatus,
    updateSettings: updateSettings
  }

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>
}

export default SettingsContextProvider

/**
 * Custom hook for Shop Settings Context
 */
export const useSettingsContext = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider')
  }
  return context
}

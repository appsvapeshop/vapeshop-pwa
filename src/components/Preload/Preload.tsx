import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { ToastContainer, Zoom } from 'react-toastify'
import { getPlatform } from '../../utils/PlatformUtils'
import { useUserContext } from '../../stores/UserContext'
import { useSettingsContext } from '../../stores/SettingsContext'
import { installPrompt, IosPrompt } from '../../utils/InstallationUtils'

import Splash from '../../pages/Splash/Splash'

import { Platform } from '../../enums/Platform'
import { AuthStatus } from '../../enums/AuthStatus'
import { FetchStatus } from '../../enums/FetchStatus'

/**
 * The component that checks whether all required data has been loaded/verified.
 * If "in progress", display the Splash screen. If completed, display children.
 */
const Preload = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useUserContext()
  const { fetchStatus } = useSettingsContext()
  const [iosPrompt, setIosPrompt] = useState(false)
  const [installationEvent, setInstallationEvent] = useState<any>()
  const [installationDispatched, setInstallationDispatched] = useState(false)

  /**
   * Show Installation prompt if it has not been shown before.
   */
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => setInstallationEvent(event))

    if (!installationDispatched && !!installationEvent) {
      installPrompt(() => showInstallPrompt(installationEvent))
      setInstallationDispatched(true)
    }

    return () => window.removeEventListener('beforeinstallprompt', (event) => setInstallationEvent(event))
  }, [installationEvent, installationDispatched])

  /**
   * Show install prompt if platform is different then IOS or if it is IOS then show instruction how to install app.
   *
   * @param event before install prompt event. Must not be null.
   */
  const showInstallPrompt = (event: any) => {
    const platform = getPlatform()
    if (platform !== Platform.IOS) {
      event.prompt()
    } else if (platform === Platform.IOS) {
      setIosPrompt(true)
    }
  }

  return (
    <>
      <ToastContainer position="top-center" toastClassName="toastify" autoClose={3000} transition={Zoom} />
      {iosPrompt && <IosPrompt />}
      <AnimatePresence mode="wait" initial={true}>
        {(authStatus === AuthStatus.NotStarted ||
          authStatus === AuthStatus.InProgress ||
          fetchStatus === FetchStatus.NotStarted ||
          fetchStatus === FetchStatus.InProgress) && <Splash key={authStatus} />}

        {(authStatus === AuthStatus.Authorized || authStatus === AuthStatus.Unauthorized) &&
          fetchStatus !== FetchStatus.NotStarted && <>{children}</>}
      </AnimatePresence>
    </>
  )
}

export default Preload

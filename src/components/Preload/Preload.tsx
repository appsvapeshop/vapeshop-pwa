import { useEffect, useState } from 'react'
import Splash from '../../pages/Splash/Splash'
import { AnimatePresence } from 'framer-motion'
import { Platform } from '../../enums/Platform'
import { AuthStatus } from '../../types/UserContext'
import { ToastContainer, Zoom } from 'react-toastify'
import { getPlatform } from '../../utils/getPlatform'
import { useUserContext } from '../../stores/UserContext'
import { SettingStatus } from '../../types/SettingsContext'
import { installPrompt, IosPrompt } from '../../utils/installer'
import { useSettingsContext } from '../../stores/SettingsContext'

const Preload = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useUserContext()
  const { settingsStatus } = useSettingsContext()
  const [iosPrompt, setIosPrompt] = useState(false)
  const [installationEvent, setInstallationEvent] = useState<any>()
  const [installationDispatched, setInstallationDispatched] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => setInstallationEvent(event))
    if (!installationDispatched && !!installationEvent) {
      installPrompt(() => install(installationEvent))
      setInstallationDispatched(true)
    }

    return () =>
      window.removeEventListener('beforeinstallprompt', (event) => setInstallationEvent(event))
  }, [installationEvent, installationDispatched])

  const install = (event: any) => {
    const platform = getPlatform()
    if (platform !== Platform.IOS) {
      event.prompt()
    } else if (platform === Platform.IOS) {
      setIosPrompt(true)
    }
  }

  return (
    <>
      <ToastContainer
        position="top-center"
        toastClassName="toastify"
        autoClose={3000}
        transition={Zoom}
      />
     {iosPrompt &&  <IosPrompt />}
      <AnimatePresence mode="wait" initial={true}>
        {(authStatus === AuthStatus.NotStarted ||
          authStatus === AuthStatus.InProgress ||
          settingsStatus === SettingStatus.NotStarted ||
          settingsStatus === SettingStatus.InProgress) && <Splash key={authStatus} />}

        {(authStatus === AuthStatus.Authorized || authStatus === AuthStatus.Unauthorized) &&
          settingsStatus !== SettingStatus.NotStarted && <>{children}</>}
      </AnimatePresence>
    </>
  )
}

export default Preload

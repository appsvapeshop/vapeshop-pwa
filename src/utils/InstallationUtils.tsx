import logo from '../assets/logo.png'
import { toast } from 'react-toastify'
import PWAPrompt from 'react-ios-pwa-prompt'

/**
 * If app is not running in standalone mode then it will display toast with installation prompt
 *
 * @param onClick event which will be fired when user click the toast. Must not be null.
 */
export const installPrompt = (onClick: (event: any) => void) => {
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    toast.info(<span onClick={onClick}>Naciśnij żeby zainstalować</span>)
  }
}

/**
 * @return installation instruction component for IOS
 */
export const IosPrompt = () => {
  return (
    <PWAPrompt
      isShown={true}
      appIconPath={logo}
      copyTitle="Zainstaluj VapeShop"
      copyDescription="Na ekranie głównym pojawi się ikona dająca szybki dostęp do tej strony"
      copyShareStep='Naciśnij przycisk "udostępnij"'
      copyAddToHomeScreenStep='Naciśnij "Dodaj do ekranu głównego"'
    />
  )
}

import logo from '../assets/logo.png'
import { toast } from 'react-toastify'
import PWAPrompt from 'react-ios-pwa-prompt'

export const installPrompt = (onClick: (event: any) => void) => {
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    toast.info(<span onClick={onClick}>Naciśnij żeby zainstalować</span>)
  }
}

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

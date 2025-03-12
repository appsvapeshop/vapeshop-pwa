import { useState, useEffect } from 'react'

/**
 * Custom Hook which checks if application working in offline mode or in online mode.
 *
 * @return
 * <ul>
 *   <li>isOnline status which may be undefined before app fully loaded.</li>
 *   <li>reconnected status when the application is back online.</li>
 * </ul>
 */
export const useNetworkStatus = () => {
  const [reconnected, setReconnected] = useState(false)
  const [isOnline, setIsOnline] = useState<boolean | undefined>()

  useEffect(() => {
    setIsOnline(window.navigator.onLine)

    window.addEventListener('online', () => {
      setIsOnline(true)
      setReconnected(true)
    })
    window.addEventListener('offline', () => {
      setIsOnline(false)
      setReconnected(false)
    })

    return () => {
      window.removeEventListener('online', () => setIsOnline(true))
      window.removeEventListener('offline', () => setIsOnline(false))
    }
  }, [])

  return { isOnline: isOnline, reconnected: reconnected }
}

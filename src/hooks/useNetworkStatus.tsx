import { useState, useEffect } from 'react'

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

import { toast } from 'react-toastify'
import Header from '../../Header/Header'
import classes from './RootLayout.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { cloneElement, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navigation from '../../Navigation/Navigation'
import { useLocation, useOutlet } from 'react-router-dom'
import { useNetworkStatus } from '../../../hooks/useNetworkStatus'

const RootLayout = () => {
  const outlet = useOutlet()
  const location = useLocation()
  const { isOnline, reconnected } = useNetworkStatus()

  useEffect(() => {
    if (!isOnline && isOnline !== undefined) {
      toast.dismiss()
      toast.info('Aplikacja działa w trybie offline')
    }
    else if(reconnected){
      toast.dismiss()
      toast.success('Aplikacja działa w trybie online')
    }
  }, [isOnline, reconnected])

  return (
      <div className={classes.container}>
        <Header />

        <AnimatePresence mode="wait" initial={true}>
          {outlet && cloneElement(outlet, { key: location.pathname })}
        </AnimatePresence>

        <Navigation />
      </div>
  )
}

export default RootLayout

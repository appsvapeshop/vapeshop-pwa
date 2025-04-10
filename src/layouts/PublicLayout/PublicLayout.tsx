import { cloneElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import classes from './PublicLayout.module.css'
import { useLocation, useOutlet } from 'react-router-dom'

/**
 * Root component for all components that are public.
 */
const PublicLayout = () => {
  const outlet = useOutlet()
  const location = useLocation()

  return (
    <div className={classes.container}>
      <AnimatePresence mode="wait" initial={true}>
        {outlet && cloneElement(outlet, { key: location.pathname })}
      </AnimatePresence>
    </div>
  )
}

export default PublicLayout

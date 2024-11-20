import { cloneElement } from 'react'
import { AnimatePresence } from 'framer-motion'
import classes from './AnimatedLayout.module.css'
import { useLocation, useOutlet } from 'react-router-dom'

const AnimatedLayout = () => {
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

export default AnimatedLayout

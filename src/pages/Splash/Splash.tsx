import { motion } from 'framer-motion'
import logo from '../../assets/logo.png'
import classes from './Splash.module.css'

/**
 * Splash screen displayed when application is loading.
 */
const Splash = () => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={classes.container}
    >
      <img alt="" src={logo} />
    </motion.div>
  )
}

export default Splash

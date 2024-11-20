import { motion } from 'framer-motion'

const AnimatedPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedPage

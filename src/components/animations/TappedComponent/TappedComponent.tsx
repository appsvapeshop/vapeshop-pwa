import React, { FC } from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
  styles?: React.CSSProperties
  scale?: number
  onClick?: () => void
}

/**
 * The component animates the onClick event.
 *
 * @param children inner components. Must not be null.
 * @param className container CSS class name. May be null.
 * @param styles container CSS styles. May be null.
 * @param scale how "strong" click animation should be ( default 0.9 ). May be null.
 * @param onClick event handler. May be null.
 */
const TappedComponent: FC<Props> = ({ children, className, styles = {}, scale = 0.9, onClick = () => {} }) => {
  return (
    <motion.div whileTap={{ scale: scale }} className={className} style={styles} onClick={onClick}>
      {children}
    </motion.div>
  )
}

export default TappedComponent

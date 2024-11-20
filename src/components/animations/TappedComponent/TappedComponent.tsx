import { FC } from 'react'
import { motion } from 'framer-motion'

type Props = {
  children: React.ReactNode
  className?: string
  styles?: React.CSSProperties
  scale?: number
  onClick?: () => void
}

const TappedComponent: FC<Props> = ({
  children,
  className,
  styles = {},
  scale = 0.9,
  onClick = () => {}
}) => {
  return (
    <motion.div whileTap={{ scale: scale }} className={className} style={styles} onClick={onClick}>
      {children}
    </motion.div>
  )
}

export default TappedComponent

import React, { FC } from 'react'
import { motion } from 'framer-motion'
import classes from './Modal.module.css'
import { createPortal } from 'react-dom'
import { IoClose } from 'react-icons/io5'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  children: React.ReactNode
  onClose: () => void
}

/**
 * Modal component.
 *
 * @param children elements. Must not be null.
 * @param onClose event handler. Must not be null.
 */
const Modal: FC<Props> = ({ children, onClose }) => {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={classes.backdrop}
      onClick={(event) => {
        if (event.target instanceof HTMLElement && event.target.classList.contains(classes.backdrop)) {
          onClose()
        }
      }}
    >
      <div className={classes.container}>
        <div className={classes['close-button-container']}>
          <TappedComponent>
            <IoClose color="var(--inactive-icon-color)" size="2rem" onClick={onClose} />
          </TappedComponent>
        </div>
        {children}
      </div>
    </motion.div>,
    document.getElementById('modal')!
  )
}

export default Modal

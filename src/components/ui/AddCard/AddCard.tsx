import { FC } from 'react'
import { FaPlus } from 'react-icons/fa'
import classes from './AddCard.module.css'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  className?: string
  onClick?: () => void
}

/**
 * Skeleton component for Product component.
 *
 * @param className container CSS class name. May be null.
 * @param onClick onClick event handler. May be null.
 */
const AddCard: FC<Props> = ({ className, onClick = () => {} }) => {
  return (
    <TappedComponent className={`${classes.container} ${className}`} onClick={onClick}>
      <FaPlus color="var(--active-icon-color)" size="3rem" />
    </TappedComponent>
  )
}

export default AddCard

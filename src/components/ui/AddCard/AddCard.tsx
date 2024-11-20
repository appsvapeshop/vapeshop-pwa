import { FaPlus } from 'react-icons/fa'
import classes from './AddCard.module.css'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'
import { FC } from 'react'

type Props = {
  className?: string
  onClick?: () => void
}

const AddCard: FC<Props> = ({ className, onClick = () => {} }) => {
  return (
    <TappedComponent className={`${classes.container} ${className}`} onClick={onClick}>
      <FaPlus color="var(--active-icon-color)" size="3rem" />
    </TappedComponent>
  )
}

export default AddCard

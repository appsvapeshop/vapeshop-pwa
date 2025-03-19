import { FC, useState } from 'react'
import Button from '../ui/Button/Button'
import classes from './Confirmation.module.css'
import PulseLoader from 'react-spinners/PulseLoader'

type Props = {
  message?: string
  onConfirmation: () => Promise<void>
  onCancel: () => Promise<void>
}

/**
 * Confirmation modal.
 *
 * @param message which will be displayed in modal. May be null.
 * @param onConfirmation event. Must not be null.
 * @param onCancel event. Must not be null.
 */
const Confirmation: FC<Props> = ({ message, onConfirmation, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Set loading indicator and fire give onConfirmation.
   */
  const confirm = async () => {
    setIsLoading(true)
    await onConfirmation()
  }

  return (
    <div className={classes.container}>
      {!!message && <span className={classes.warning}>{message}</span>}

      <span className={classes.text}>Czy na pewno chcesz kontynuować ?</span>

      <div className={classes.buttons}>
        <Button styles={{ width: '100%', height: '2rem' }} onClick={confirm}>
          {isLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Tak'}
        </Button>
        <Button styles={{ width: '100%', height: '2rem' }} onClick={onCancel}>
          {isLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Nie'}
        </Button>
      </div>
    </div>
  )
}

export default Confirmation

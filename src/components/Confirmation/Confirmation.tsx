import { FC, useState } from 'react'
import Button from '../ui/Button/Button'
import classes from './Confirmation.module.css'
import PulseLoader from 'react-spinners/PulseLoader'

type Props = {
  warning?: string
  onConfirmation: () => Promise<void>
  onCancel: () => Promise<void>
}

const Confirmation: FC<Props> = ({ warning, onConfirmation, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false)

  const confirm = async () => {
    setIsLoading(true)
    await onConfirmation()
  }

  return (
    <div className={classes.container}>
      {!!warning && <span className={classes.warning}>{warning}</span>}
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

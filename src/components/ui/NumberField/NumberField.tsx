import { FC } from 'react'
import classes from './NumberField.module.css'
import { FaPlus, FaMinus } from 'react-icons/fa6'
import { TextField as MuiTextField } from '@mui/material'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  label?: string
  value?: number | undefined
  slotProps?: any
  styles?: React.CSSProperties
  readOnly?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  incrementHandler?: () => void
  decrementHandler?: () => void
}

const NumberField: FC<Props> = ({
  label,
  value,
  slotProps,
  styles,
  onChange,
  decrementHandler,
  incrementHandler,
  readOnly = false
}) => {
  return (
    <div className={classes.quantity}>
      {!readOnly && (
        <TappedComponent onClick={decrementHandler}>
          <FaMinus size="1rem" color="var(--inactive-icon-color)" />
        </TappedComponent>
      )}
      <MuiTextField
        disabled
        className={classes.input}
        label={label}
        variant="outlined"
        color="secondary"
        type="number"
        value={value || ''}
        onChange={onChange}
        slotProps={slotProps}
        style={styles}
      />
      {!readOnly && (
        <TappedComponent onClick={incrementHandler}>
          <FaPlus size="1rem" color="var(--inactive-icon-color)" />
        </TappedComponent>
      )}
    </div>
  )
}

export default NumberField

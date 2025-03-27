import React, { FC } from 'react'
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

/**
 * Number input which allow increase and decrese value by clicking "-" or "+" icons
 *
 * @param label. May be null.
 * @param value. May be null.
 * @param slotProps The props used for each slot inside. May be null.
 * @param styles input CSS styles. May be null.
 * @param readOnly Can the value be changed, default false. May be null.
 * @param onChange event handler, when value is inserted. May be null.
 * @param incrementHandler event handler, when value is increased. May be null.
 * @param decrementHandler event handler, when value is decreased. May be null.
 */
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

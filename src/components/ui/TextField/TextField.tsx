import React, { FC } from 'react'
import classes from './TextField.module.css'
import { TextField as MuiTextField } from '@mui/material'

type Props = {
  label: string
  value: string | number | undefined
  type?: string
  slotProps?: any
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Number input which allow increase and decrese value by clicking "-" or "+" icons
 *
 * @param label. Must not be null.
 * @param value. Must not be null.
 * @param type HTML input type. May be null.
 * @param slotProps The props used for each slot inside. May be null.
 * @param onChange event handler, when value is inserted. Must not be null.
 */
const TextField: FC<Props> = ({ label, value, onChange, slotProps, type = 'text' }) => {
  return (
    <MuiTextField
      className={classes.input}
      label={label}
      variant="outlined"
      color="secondary"
      type={type}
      value={value || ''}
      onChange={onChange}
      slotProps={slotProps}
    />
  )
}

export default TextField

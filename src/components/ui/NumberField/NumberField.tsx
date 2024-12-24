import { FC } from 'react'
import classes from './NumberField.module.css'
import { TextField as MuiTextField } from '@mui/material'

type Props = {
  label?: string
  value?: number | undefined
  slotProps?: any
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  styles?: React.CSSProperties
}

const NumberField: FC<Props> = ({ label, value, onChange, slotProps, styles }) => {
  return (
    <MuiTextField
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
  )
}

export default NumberField

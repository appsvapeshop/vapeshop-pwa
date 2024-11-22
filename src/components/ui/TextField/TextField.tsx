import { FC } from 'react'
import classes from './TextField.module.css'
import { TextField as MuiTextField } from '@mui/material'

type Props = {
  label: string
  value: string | number | undefined
  type?: string
  slotProps?: any
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

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

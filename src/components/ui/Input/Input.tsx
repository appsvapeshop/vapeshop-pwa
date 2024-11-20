import { FC } from 'react'
import TextField from '@mui/material/TextField'
import { OverridableStringUnion } from '@mui/types'
import { TextFieldVariants } from '@mui/material/TextField'

type Props = {
  label?: string
  value?: any
  type?: string
  variant: TextFieldVariants
  styles?: React.CSSProperties
  colorVariant?: OverridableStringUnion<
    'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  >
  autoComplete?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: FC<Props> = ({
  label,
  value,
  type = 'text',
  variant,
  styles,
  colorVariant = 'primary',
  autoComplete,
  onChange
}) => {
  const defaultStyle: React.CSSProperties = {}

  return (
    <TextField
      value={value}
      name={type}
      type={type}
      label={label}
      style={{ ...defaultStyle, ...styles }}
      color={colorVariant}
      variant={variant}
      autoComplete={autoComplete}
      slotProps={{ input: { style: { borderRadius: '20px' } } }}
      onChange={onChange}
    />
  )
}

export default Input

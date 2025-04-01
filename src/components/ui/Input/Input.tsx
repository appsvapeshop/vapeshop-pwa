import React, { FC } from 'react'
import TextField from '@mui/material/TextField'
import { OverridableStringUnion } from '@mui/types'
import { TextFieldVariants } from '@mui/material/TextField'

type Props = {
  label?: string
  value?: any
  type?: string
  variant: TextFieldVariants
  styles?: React.CSSProperties
  colorVariant?: OverridableStringUnion<'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'>
  autoComplete?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Button component with default animation and styles.
 *
 * @param label. May be null.
 * @param value. May be null.
 * @param type default "text". May be null.
 * @param variant 'outlined' | 'standard' | 'filled'. Must not be null.
 * @param styles button CSS styles. May not be null.
 * @param colorVariant "primary" | "secondary" | "success" | "error" | "info" | "warning". Default "primary". May not be null.
 * @param autoComplete helps users to fill forms faster, especially on mobile devices. May be null.
 * @param onChange event handler. May be null.
 */
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

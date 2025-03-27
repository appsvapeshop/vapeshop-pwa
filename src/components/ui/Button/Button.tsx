import React, { FC } from 'react'
import MaterialButton from '@mui/material/Button'
import { OverridableStringUnion } from '@mui/types'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  children: React.ReactNode
  styles?: React.CSSProperties
  containerStyle?: React.CSSProperties
  variant?: OverridableStringUnion<'text' | 'outlined' | 'contained'>
  colorVariant?: OverridableStringUnion<'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'>
  onClick: () => void
}

/**
 * Button component with default animation and styles.
 *
 * @param children elements. Must not be null.
 * @param styles button CSS styles. May not be null.
 * @param containerStyle button container CSS styles. May not be null.
 * @param variant "text" | "outlined" | "contained". Default "contained". May not be null.
 * @param colorVariant "primary" | "secondary" | "success" | "error" | "info" | "warning". Default "primary". May be null.
 * @param onClick onClick event handler. Must not be null.
 */
const Button: FC<Props> = ({
  children,
  styles = {},
  containerStyle = {},
  variant = 'contained',
  colorVariant = 'primary',
  onClick
}) => {
  const defaultStyle: React.CSSProperties = {
    width: '100%',
    margin: '0.8rem 0',
    padding: '0.5rem 1rem',
    fontSize: '0.85rem',
    fontWeight: '400',
    borderRadius: '20px',
    textTransform: 'none',
    borderWidth: '2px'
  }

  const defaultContainerStyle: React.CSSProperties = {
    width: '100%',
    textAlign: 'center'
  }

  return (
    <TappedComponent styles={{ ...defaultContainerStyle, ...containerStyle }}>
      <MaterialButton color={colorVariant} variant={variant} style={{ ...defaultStyle, ...styles }} onClick={onClick}>
        {children}
      </MaterialButton>
    </TappedComponent>
  )
}

export default Button

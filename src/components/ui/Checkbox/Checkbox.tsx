import React, { FC } from 'react'
import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material'

type Props = {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Checkbox component with default styles.
 *
 * @param label. Must not be null.
 * @param checked. Must not be null.
 * @param onChange onChange event handler. Must not be null.
 */
const Checkbox: FC<Props> = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      labelPlacement="top"
      label={label}
      control={
        <MuiCheckbox style={{ transform: 'scale(1.2)' }} color="secondary" checked={checked} onChange={onChange} />
      }
    />
  )
}

export default Checkbox

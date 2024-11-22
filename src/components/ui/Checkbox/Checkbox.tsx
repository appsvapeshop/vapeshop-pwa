import { FormControlLabel, Checkbox as MuiCheckbox } from '@mui/material'
import { FC } from 'react'

type Props = {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: FC<Props> = ({ label, checked, onChange }) => {
  return (
    <FormControlLabel
      labelPlacement="top"
      label={label}
      control={
        <MuiCheckbox
          style={{ transform: 'scale(1.2)' }}
          color="secondary"
          checked={checked}
          onChange={onChange}
        />
      }
    />
  )
}

export default Checkbox

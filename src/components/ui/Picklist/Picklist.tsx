import { FC } from 'react'
import classes from './Picklist.module.css'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

type Props = {
  label: string
  value?: string | undefined
  options: { name: string; value: string }[]
  onChange: (event: any) => void
}

const Picklist: FC<Props> = ({ label, value, options, onChange }) => {
  return (
    <FormControl color="secondary" className={classes.input}>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value || ''}
        onChange={onChange}
        MenuProps={{
          sx: {
            '&& .Mui-selected': {
              backgroundColor: 'rgba(0,0,0,0.1)'
            }
          }
        }}
      >
        <MenuItem key="empty-category"></MenuItem>

        {options?.map((option) => (
          <MenuItem key={`${option.name}-${option.value}`} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default Picklist

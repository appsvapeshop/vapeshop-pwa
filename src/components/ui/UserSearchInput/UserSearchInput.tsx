import { User } from '../../../types/User'
import React, { FC, useState } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { searchUsers } from '../../../services/UserService'
import classes from './UserSearchInput.module.css'

type Props = {
  onUserSelect: (user: User) => void
}

/**
 * The component allows you to search for users.
 */
const UserSearchInput: FC<Props> = ({ onUserSelect }) => {
  const [customers, setCustomers] = useState<User[]>([])
  const [noOptionText, setNoOptionText] = useState<string>('Wprowadź min 3 znaki')

  /**
   * Search user for given search params. Require minimum 5 characters.
   */
  const onSearch = async (event: React.KeyboardEvent) => {
    if ((event.target as HTMLInputElement).value.length < 3) {
      setNoOptionText('Wprowadź 5 pierwszych znaków')
      return
    }

    const users = await searchUsers((event.target as HTMLInputElement).value)
    if (users.length === 0) {
      setNoOptionText('Nie znaleziono')
      return
    }

    setCustomers(users)
  }

  return (
    <Autocomplete
      className={classes['autocomplete']}
      clearOnBlur
      autoHighlight
      disablePortal
      noOptionsText={noOptionText}
      renderInput={(params) => <TextField className={classes.search} color="secondary" label="Klient" {...params} />}
      options={customers.map((customer) => {
        return { label: customer.email, value: customer }
      })}
      onKeyUp={onSearch}
      onBlur={() => setCustomers([])}
      onChange={(_event, option) => {
        onUserSelect(option!.value)
      }}
    />
  )
}

export default UserSearchInput

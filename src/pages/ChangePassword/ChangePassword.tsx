import { useState } from 'react'
import { toast } from 'react-toastify'
import classes from './ChangePassword.module.css'
import Input from '../../components/ui/Input/Input'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import PasswordValidator from '../../components/PasswordValidator/PasswordValidator'
import { changePassword } from '../../services/UserService'

type Passwords = {
  oldPassword?: string
  newPassword?: string
  rePassword?: string
}

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [passwords, setPasswords] = useState<Passwords>({})

  const onSave = async () => {
    if (!passwords?.oldPassword || !passwords?.newPassword || !passwords?.rePassword) {
      toast.dismiss()
      toast.error('Uzupełnij wszystkie pola')
      return
    }

    if (passwords.newPassword !== passwords.rePassword) {
      toast.dismiss()
      toast.error('Nowe hasła są różne')
      return
    }

    setIsLoading(true)
    try {
      await changePassword(passwords?.oldPassword!, passwords?.newPassword!)
      toast.success('Hasło zostało zmienione')
    } catch (error) {
      toast.error((error as Error).message)
    }

    setIsLoading(false)
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        <Input
          label="Hasło"
          type="password"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="current-password"
          onChange={(event) =>
            setPasswords({ ...passwords, oldPassword: (event.target as HTMLInputElement).value })
          }
        />
        <Input
          label="Nowe hasło"
          type="password"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="new-password"
          onChange={(event) =>
            setPasswords({ ...passwords, newPassword: (event.target as HTMLInputElement).value })
          }
        />
        <PasswordValidator
          className={classes['password-validator']}
          password={passwords.newPassword}
        />
        <Input
          label="Powtórz hasło"
          type="password"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="new-password"
          onChange={(event) =>
            setPasswords({ ...passwords, rePassword: (event.target as HTMLInputElement).value })
          }
        />
        <Button styles={{ height: '2.5rem', width: '70%' }} colorVariant="primary" onClick={onSave}>
          {isLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
        </Button>
      </div>
    </AnimatedPage>
  )
}

export default ChangePassword

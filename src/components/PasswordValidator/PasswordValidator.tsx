import { FC } from 'react'
import classes from './PasswordValidator.module.css'

type Props = {
  password?: string
  className?: string
}

/**
 * The component displays all password requirements and if someone is met it is crossed off the list.
 *
 * @param password user password. May be null.
 * @param className container CSS class name. May be null.
 */
const PasswordValidator: FC<Props> = ({ password = '', className }) => {
  return (
    <ul className={`${classes.container} ${className}`}>
      <li className={/[a-z]/.test(password) ? classes.valid : ''}>Mała litera</li>
      <li className={/[A-Z]/.test(password) ? classes.valid : ''}>Duża litera</li>
      <li className={/[0-9]/.test(password) ? classes.valid : ''}>Cyfra</li>
      <li className={/\S{8,}/.test(password) ? classes.valid : ''}>Minimum 8 znaków</li>
      <li className={/.*[!@#$%^&*]/.test(password) ? classes.valid : ''}>Znak specjalny ( !@#$%^&* )</li>
    </ul>
  )
}

export default PasswordValidator

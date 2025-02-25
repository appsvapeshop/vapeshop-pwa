import { UserRole } from '../../enums/UserRole'
import { useNavigate } from 'react-router-dom'
import classes from './AccountSettings.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { useUserContext } from '../../stores/UserContext'

const AccountSettings = () => {
  const navigate = useNavigate()
  const { user, signOut } = useUserContext()

  const onSignOut = () => {
    signOut()
    navigate('/p/login')
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        <IoPersonCircleOutline size={180} color="var(--inactive-icon-color)" />
        <span>{user?.email.split('@')[0]}</span>
        <span>{user?.points}</span>
        <span>Zdobyte punkty</span>

        <div className={classes['buttons-container']}>
          {user?.role === UserRole.Admin && (
            <Button
              styles={{ height: '3rem', fontWeight: '500' }}
              variant="outlined"
              colorVariant="secondary"
              onClick={() => {
                navigate('/admin/panel')
              }}
            >
              Panel administacyjny
            </Button>
          )}

          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('changePassword')
            }}
          >
            Zmień hasło
          </Button>

          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('/regulations')
            }}
          >
            Regulamin
          </Button>

          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={onSignOut}
          >
            Wyloguj
          </Button>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default AccountSettings

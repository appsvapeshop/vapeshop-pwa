import classes from './AdminPanel.module.css'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/ui/Button/Button'
import { AnimatedPage } from '../Cart/cartComponents'

const AdminPanel = () => {
  const navigate = useNavigate()

  return (
    <AnimatedPage>
      <div className={classes.container}>
        <div className={classes.buttons}>
          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('shopSettings')
            }}
          >
            Ustawienia sklepu
          </Button>
          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('clients')
            }}
          >
            Panel klienta
          </Button>
          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {navigate('manageNews')}}
          >
            Zarządzaj wiadomościami
          </Button>
          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('manageCategories')
            }}
          >
            Zarządzaj kategoriami
          </Button>
          <Button
            styles={{ height: '3rem', fontWeight: '500' }}
            variant="outlined"
            colorVariant="secondary"
            onClick={() => {
              navigate('manageProducts')
            }}
          >
            Zarządzaj produktami
          </Button>
        </div>
      </div>
    </AnimatedPage>
  )
}

export default AdminPanel

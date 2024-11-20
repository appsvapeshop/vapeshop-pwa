import { useState } from 'react'
import Modal from '../ui/Modal/Modal'
import { UserRole } from '../../types/User'
import UserCard from '../UserCard/UserCard'
import classes from './Navigation.module.css'
import QrScanner from '../QrScanner/QrScanner'
import { AnimatePresence } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import { getIconColor } from '../../utils/getIconColor'
import { useUserContext } from '../../stores/UserContext'
import TappedComponent from '../animations/TappedComponent/TappedComponent'
import { Cart, Newspaper, Home, Coupons, QR, Card } from './navigationIcons'

const Navigation = () => {
  const iconSize = 35
  const location = useLocation()
  const { user } = useUserContext()
  const [cardVisible, setCardVisible] = useState(false)
  const [scannerVisible, setScannerVisible] = useState(false)

  return (
    <div className={classes.container}>
      <NavLink to="/">
        <TappedComponent scale={0.8}>
          <Home size={iconSize} color={getIconColor(location.pathname, '/')} />
        </TappedComponent>
      </NavLink>
      <NavLink to="/coupons">
        <TappedComponent scale={0.8}>
          <Coupons size={iconSize} color={getIconColor(location.pathname, '/coupons')} />
        </TappedComponent>
      </NavLink>

      {user?.role === UserRole.Admin && (
        <TappedComponent scale={0.8} onClick={() => setScannerVisible(true)}>
          <QR size={iconSize} color={getIconColor(location.pathname, '/qr')} />
        </TappedComponent>
      )}

      {user?.role === UserRole.Customer && (
        <TappedComponent scale={0.8} onClick={() => setCardVisible(true)}>
          <Card size={iconSize} color={getIconColor(location.pathname, '/card')} />
        </TappedComponent>
      )}

      <NavLink to="/newspaper">
        <TappedComponent scale={0.8}>
          <Newspaper size={iconSize} color={getIconColor(location.pathname, '/newspaper')} />
        </TappedComponent>
      </NavLink>
      <NavLink to="/cart">
        <TappedComponent scale={0.8}>
          <Cart size={iconSize} color={getIconColor(location.pathname, '/cart')} />
        </TappedComponent>
      </NavLink>

      <AnimatePresence mode="wait">
        {cardVisible && (
          <Modal onClose={() => setCardVisible(false)}>
            <UserCard />
          </Modal>
        )}

        {scannerVisible && (
          <Modal onClose={() => setScannerVisible(false)}>
            <QrScanner onClose={() => setScannerVisible(false)} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navigation

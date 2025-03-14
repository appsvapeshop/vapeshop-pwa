import classes from './Header.module.css'
import { FaUserGear } from 'react-icons/fa6'
import banner from '../../assets/banner.png'
import { IoIosArrowBack } from 'react-icons/io'
import { getIconColor } from '../../utils/StylingUtils'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

const Header = () => {
  const iconSize = 40
  const navigation = useNavigate()
  const location = useLocation()

  return (
    <header className={classes.container}>
      <TappedComponent className={classes['step-back']}>
        <IoIosArrowBack
          className={classes['step-back-icon']}
          size={iconSize}
          onClick={() => navigation(-1)}
        />
      </TappedComponent>

      <img className={classes.banner} src={banner} alt="VapeShop" />

      <NavLink to="/accountSettings">
        <TappedComponent className={classes.settings}>
          <FaUserGear size={iconSize} color={getIconColor(location.pathname, '/accountSettings')} />
        </TappedComponent>
      </NavLink>
    </header>
  )
}

export default Header

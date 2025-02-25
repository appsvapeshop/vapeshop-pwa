import { Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { UserRole } from '../../../enums/UserRole'
import { useUserContext } from '../../../stores/UserContext'

const AdminRoute = () => {
  const { user } = useUserContext()
  return user === null || user.role === UserRole.Customer ? <Navigate to="/" /> : <Outlet />
}

export default AdminRoute

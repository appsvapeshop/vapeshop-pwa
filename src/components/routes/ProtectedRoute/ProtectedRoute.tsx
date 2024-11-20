import { Navigate } from 'react-router-dom'
import { useUserContext } from '../../../stores/UserContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext()
  return user === null ? <Navigate to="/p/login" /> : <>{children}</>
}

export default ProtectedRoute

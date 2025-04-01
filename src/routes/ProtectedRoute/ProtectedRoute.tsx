import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserContext } from '../../stores/UserContext'

/**
 * Route that requires user to be authorized. If not granted then reroute to login page.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext()
  return !user ? <Navigate to="/p/login" /> : <>{children}</>
}

export default ProtectedRoute

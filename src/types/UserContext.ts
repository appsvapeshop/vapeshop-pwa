import { User } from './User'
import { AuthStatus } from '../enums/AuthStatus'

/**
 * User context type
 */
export type UserContext = {
  /**
   * Instance of current user
   */
  user: User

  /**
   * User authentication status
   */
  authStatus: AuthStatus

  /**
   * Sign in user using email and password
   */
  signIn: (email: string, password: string) => Promise<void>

  /**
   * Logout user
   */
  signOut: () => void

  /**
   * Refresh user instance ( will refresh points that user has )
   */
  refreshUser: () => Promise<void>
}

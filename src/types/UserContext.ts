import { User } from './User'
import { Transaction } from './Transaction'
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
   * Create user using email and password
   */
  createUser: (email: string, password: string) => Promise<void>

  /**
   * Reset user password (if exist for given email )
   */
  resetPassword: (email: string) => Promise<void>

  /**
   * Refresh user instance ( will refresh points that user has )
   */
  refreshUser: () => Promise<void>

  /**
   * Add transaction to database
   * TODO move to database / transaction utils
   */
  addTransaction: (transaction: Transaction) => Promise<void>

  /**
   * Change password for current user
   */
  changePassword: (oldPassword: string, newPassword: string, rePassword: string) => Promise<void>
}

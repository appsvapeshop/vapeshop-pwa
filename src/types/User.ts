import { UserRole } from '../enums/UserRole'
import { Timestamp } from 'firebase/firestore'

/**
 * User type
 */
export type User = {
  /**
   * User Id
   */
  id: string

  /**
   * User email
   */
  email: string

  /**
   * User role
   */
  role: UserRole

  /**
   * Points the user has
   */
  points: number

  /**
   * User registration date
   */
  createDate: Timestamp
}

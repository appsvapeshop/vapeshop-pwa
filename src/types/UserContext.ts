import { User } from './User'
import { Transaction } from './Transaction'

export type UserContext = {
  user: User | null
  authStatus: AuthStatus
  signIn: (email: string, password: string) => Promise<void> | undefined
  signOut: () => void | undefined
  createUser: (email: string, password: string) => Promise<void> | undefined
  resetPassword: (email: string) => Promise<void> | undefined
  refreshUser: () => Promise<void> | undefined
  addTransaction: (transaction: Transaction) => Promise<void> | undefined
  changePassword: (
    oldPassword: string,
    newPassword: string,
    rePassword: string
  ) => Promise<void> | undefined
}

export enum AuthStatus {
  NotStarted,
  InProgress,
  Authorized,
  Unauthorized
}

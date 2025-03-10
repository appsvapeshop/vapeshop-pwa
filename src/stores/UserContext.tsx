import { UserRole } from '../enums/UserRole'
import { AuthStatus } from '../enums/AuthStatus'
import { TransactionMode } from '../enums/TransactionMode'

import EmailInUse from '../exceptions/EmailInUse'
import InvalidEmail from '../exceptions/InvalidEmail'
import WeakPassword from '../exceptions/WeakPassword'
import ErrorOccurred from '../exceptions/ErrorOccurred'
import InvalidCredential from '../exceptions/InvalidCredential'
import InvalidOldPassword from '../exceptions/InvalidOldPassword'

import { User } from '../types/User'
import { Transaction } from '../types/Transaction'

import { getUser } from '../utils/userUtils'
import { FirebaseError } from '@firebase/util'
import { auth, firestore } from '../configs/firebaseConfig'
import { UserContext as UserContextType } from '../types/UserContext'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { addDoc, collection, updateDoc, doc, increment } from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider
} from 'firebase/auth'

/**
 * User Context. Is null before initialization
 */
const UserContext = createContext<UserContextType | null>(null)

/**
 * User Context Provider. Provides the currently logged-in user and useful user management functions
 */
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>()
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.NotStarted)

  /**
   * Subscribe and load current logged-in user when application loads. Unsubscribe after loaded user
   */
  useEffect(() => {
    setAuthStatus(AuthStatus.InProgress)

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser && authUser.email) {
        const loadedUser = await getUser(authUser.email)

        setUser(loadedUser)
        setAuthStatus(AuthStatus.Authorized)
      } else {
        setAuthStatus(AuthStatus.Unauthorized)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * Sign in user using email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)

      const loadedUser = await getUser(email)

      setUser(loadedUser)
      setAuthStatus(AuthStatus.Authorized)
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/invalid-email') throw new InvalidEmail()
      if ((error as FirebaseError).code === 'auth/invalid-credential') throw new InvalidCredential()

      throw new ErrorOccurred()
    }
  }

  /**
   * Sign out current user and update Auth Status
   */
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        setAuthStatus(AuthStatus.Unauthorized)
      })
      .catch(() => {
        throw new ErrorOccurred()
      })
  }

  /**
   * Create new user with email/password
   *
   * @param email user email. Must not be null
   * @param password user password. Must not be null
   */
  const createUser = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await addDoc(collection(firestore, 'users'), {
        email: email,
        points: 0,
        role: UserRole.Customer
      })
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/email-already-in-use') throw new EmailInUse()
      if ((error as FirebaseError).code === 'auth/password-does-not-meet-requirements') throw new WeakPassword()
      throw new ErrorOccurred()
    }
  }

  /**
   * Reset user password and send new one to email
   *
   * @param email user email. Must not be null
   */
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  /**
   * Refresh current user data e.g. user points*
   */
  const refreshUser = async () => {
    if (user?.email) {
      setUser(await getUser(user.email))
    } else {
      throw new ErrorOccurred()
    }
  }

  /**
   * Add new transaction for current user
   *
   * @param transaction data. Must not be null
   */
  const addTransaction = async (transaction: Transaction) => {
    const points =
      transaction.transactionMode === TransactionMode.Exchange ? transaction.points * -1 : transaction.points

    await updateDoc(doc(firestore, 'users', transaction.customerId), { points: increment(points) })
    await addDoc(collection(firestore, 'transactions'), transaction)
  }

  /**
   * Change current user password
   *
   * @param oldPassword old user password. Must not be null
   * @param newPassword new user password. Must not be null
   */
  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!auth?.currentUser?.email) throw new ErrorOccurred()

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/invalid-credential') throw new InvalidOldPassword()
      if ((error as FirebaseError).code === 'auth/password-does-not-meet-requirements') throw new WeakPassword()
      throw new ErrorOccurred()
    }
  }

  const contextValue: UserContextType = {
    user: user!,
    authStatus: authStatus,
    signIn: signIn,
    signOut: signOut,
    createUser: createUser,
    resetPassword: resetPassword,
    refreshUser: refreshUser,
    addTransaction: addTransaction,
    changePassword: changePassword
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default UserContextProvider

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}

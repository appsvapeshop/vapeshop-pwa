import { User } from '../types/User'
import { AuthStatus } from '../enums/AuthStatus'

import InvalidEmail from '../exceptions/InvalidEmail'
import ErrorOccurred from '../exceptions/ErrorOccurred'
import InvalidCredential from '../exceptions/InvalidCredential'

import { FirebaseError } from '@firebase/util'
import { auth } from '../configs/firebaseConfig'
import { getUserByEmail } from '../services/UserService'
import { UserContext as UserContextType } from '../types/UserContext'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { setPersistence, onAuthStateChanged, signInWithEmailAndPassword, browserLocalPersistence } from 'firebase/auth'

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
        const loadedUser = await getUserByEmail(authUser.email)

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

      const loadedUser = await getUserByEmail(email)

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
   * Refresh current user data e.g. user points*
   */
  const refreshUser = async () => {
    if (user?.email) {
      setUser(await getUserByEmail(user.email))
    } else {
      throw new ErrorOccurred()
    }
  }

  const contextValue: UserContextType = {
    user: user!,
    authStatus: authStatus,
    signIn: signIn,
    signOut: signOut,
    refreshUser: refreshUser
  }

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export default UserContextProvider

/**
 * Custom hook for User Context
 */
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}

import { getUser } from '../utils/userUtils'
import { User, UserRole } from '../types/User'
import { FirebaseError } from '@firebase/util'
import { AuthStatus } from '../types/UserContext'
import { Transaction } from '../types/Transaction'
import { TransactionMode } from '../enums/TransactionMode'
import { auth, firestore } from '../configs/firebaseConfig'
import { UserContext as UserContextType } from '../types/UserContext'
import { createContext, useState, useContext, useEffect } from 'react'
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

const UserContext = createContext<UserContextType | null>(null)

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.NotStarted)

  useEffect(() => {
    setAuthStatus(AuthStatus.InProgress)

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const firestoreUser = await getUser(authUser.email!)
        setUser(firestoreUser)
        setAuthStatus(AuthStatus.Authorized)
      } else {
        setUser(null)
        setAuthStatus(AuthStatus.Unauthorized)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, email, password)

      const firestoreUser = await getUser(email)
      setUser(firestoreUser)
      setAuthStatus(AuthStatus.Authorized)
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/invalid-email')
        throw new Error('Email niepoprawny')
      if ((error as FirebaseError).code === 'auth/invalid-credential')
        throw new Error('Email lub hasło jest niepoprawne')

      throw new Error('Error occurs')
    }
  }

  const signOut = () => {
    auth.signOut()
  }

  const createUser = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      await addDoc(collection(firestore, 'users'), {
        email: email,
        points: 0,
        role: UserRole.Customer
      })
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/email-already-in-use')
        throw new Error('Email jest już w użyciu')
      if ((error as FirebaseError).code === 'auth/password-does-not-meet-requirements')
        throw new Error('Hasło jest za słabe')

      throw new Error('Error occurs')
    }
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const refreshUser = async () => {
    const firestoreUser = await getUser(user!.email)
    setUser(firestoreUser)
  }

  const addTransaction = async (transaction: Transaction) => {
    const points =
      transaction.mode === TransactionMode.Exchange ? transaction.points * -1 : transaction.points

    await updateDoc(doc(firestore, 'users', transaction.userId), { points: increment(points) })
    await addDoc(collection(firestore, 'transactions'), transaction)
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (auth?.currentUser?.email === null || auth?.currentUser?.email === undefined)
      throw new Error('User unauthorized')

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword)
      await reauthenticateWithCredential(auth.currentUser, credential)
      await updatePassword(auth.currentUser, newPassword)
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/invalid-credential')
        throw new Error('Stare hasło jest niepoprawne')
      if ((error as FirebaseError).code === 'auth/weak-password')
        throw new Error('Hasło powinno mieć minimum 6 znaków')
      throw new Error('Coś poszło nie tak')
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        authStatus,
        signIn,
        signOut,
        createUser,
        resetPassword,
        refreshUser,
        addTransaction,
        changePassword
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}

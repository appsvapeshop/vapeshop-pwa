import { User } from '../types/User'
import { UserRole } from '../enums/UserRole'
import { Transaction } from '../types/Transaction'
import { TransactionMode } from '../enums/TransactionMode'

import EmailInUse from '../exceptions/EmailInUse'
import UserNotFound from '../exceptions/UserNotFound'
import WeakPassword from '../exceptions/WeakPassword'
import ErrorOccurred from '../exceptions/ErrorOccurred'
import InvalidOldPassword from '../exceptions/InvalidOldPassword'

import { auth, firestore } from '../configs/firebaseConfig'
import { addDoc, collection, doc, getDocs, increment, query, updateDoc, where } from 'firebase/firestore'
import {
  updatePassword,
  EmailAuthProvider,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { FirebaseError } from '@firebase/util'

/**
 * Select user for given email
 *
 * @param email user email. Must not be null
 *
 * @return user for given email
 */
export const getUser = async (email: string): Promise<User> => {
  const usersCollections = collection(firestore, 'users')
  const userQuery = query(usersCollections, where('email', '==', email))
  const users = await getDocs(userQuery)

  if (users.size === 0 || users.size > 1) throw new UserNotFound()
  const user = users.docs[0].data()

  return {
    id: users.docs[0].id,
    email: user.email,
    points: user.points,
    role: user.role,
    createDate: user.createDate
  }
}

/**
 * Create new user with email/password
 *
 * @param email user email. Must not be null
 * @param password user password. Must not be null
 */
export const createUser = async (email: string, password: string) => {
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
 * Add new transaction for current user
 *
 * @param transaction data. Must not be null
 */
export const addTransaction = async (transaction: Transaction) => {
  const points = transaction.transactionMode === TransactionMode.Exchange ? transaction.points * -1 : transaction.points

  await updateDoc(doc(firestore, 'users', transaction.customerId), { points: increment(points) })
  await addDoc(collection(firestore, 'transactions'), transaction)
}

/**
 * Reset user password and send new one to email
 *
 * @param email user email. Must not be null
 */
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email)
}

/**
 * Change current user password
 *
 * @param oldPassword old user password. Must not be null
 * @param newPassword new user password. Must not be null
 */
export const changePassword = async (oldPassword: string, newPassword: string) => {
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

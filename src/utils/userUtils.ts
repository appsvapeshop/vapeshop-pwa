import { User } from '../types/User'
import { firestore } from '../configs/firebaseConfig'
import { getDocs, collection, where, query, orderBy, startAt, endAt } from 'firebase/firestore'

export const getUser = async (email: string): Promise<User> => {
  const usersCollections = collection(firestore, 'users')
  const userQuery = query(usersCollections, where('email', '==', email))
  const users = await getDocs(userQuery)

  if (users.size === 0 || users.size > 1) throw new Error('User snapshot - wrong size')
  const user = users.docs[0].data()

  return {
    id: users.docs[0].id,
    email: user.email,
    points: user.points,
    role: user.role
  }
}

export const getUserById = async (id: string): Promise<User> => {
  const usersCollections = collection(firestore, 'users')
  const userQuery = query(usersCollections, where('__name__', '==', id))
  const users = await getDocs(userQuery)

  if (users.size === 0 || users.size > 1) throw new Error('User snapshot - wrong size')
  const user = users.docs[0].data()

  return {
    id: users.docs[0].id,
    email: user.email,
    points: user.points,
    role: user.role
  }
}

export const searchUsers = async (searchValue: string): Promise<User[]> => {
  const usersCollections = collection(firestore, 'users')
  const searchQuery = query(
    usersCollections,
    orderBy('email'),
    startAt(searchValue.toLowerCase()),
    endAt(searchValue.toLowerCase() + '\uf8ff')
  )
  const usersSnapshot = await getDocs(searchQuery)

  return usersSnapshot.docs.map((user) => {
    const userData = Object.assign({ id: user.id }, user.data())
    return userData as User
  })
}

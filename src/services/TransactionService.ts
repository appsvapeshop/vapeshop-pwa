import { Transaction } from '../types/Transaction'
import { firestore } from '../configs/firebaseConfig'

import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'

/**
 * Get all user Transactions.
 *
 * @param userId. Must not be null.
 *
 * @return all transaction for given user.
 */
export const getUserTransactions = async (userId: string) => {
  const transactionsCollection = collection(firestore, 'transactions')
  const transactionsQuery = query(transactionsCollection, where('customerId', '==', userId), orderBy('transactionDate', 'desc'))
  const transactionsSnapshot = await getDocs(transactionsQuery)

  if (transactionsSnapshot.docs.length === 0) return []

  return transactionsSnapshot.docs.map((transaction) => {
    const transactionData = Object.assign({ id: transaction.id }, transaction.data())
    return transactionData as Transaction
  })
}

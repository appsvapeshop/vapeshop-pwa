import { QrData } from '../types/QrData'
import { sumPoints, sumPrice } from './productsHelper'
import { Transaction } from '../types/Transaction'
import { firestore } from '../configs/firebaseConfig'
import { Product as ProductType } from '../types/Product'
import { getDocs, collection, query, where, orderBy } from 'firebase/firestore'

export const isAmountsValid = (databaseProducts: Array<ProductType>, qrData: QrData): boolean => {
  const databaseAmount = sumPrice(databaseProducts)
  const databasePointsAmount = sumPoints(databaseProducts)
  return databaseAmount === qrData.cartAmount && databasePointsAmount === qrData.pointAmount
}

export const getDatabaseProducts = (
  retrievedProducts: any,
  qrData: QrData
): ProductType[] => {
  const databaseProducts: ProductType[] = []

  retrievedProducts.forEach((retrievedProduct: any) => {
    if(!retrievedProduct.variants || retrievedProduct.variants.length === 0){
      // @ts-ignore
      const productQuantity = qrData.productsSummary![retrievedProduct.id][retrievedProduct.id] || 0
      for (let i: number = 1; i <= productQuantity; i++){
        databaseProducts.push(retrievedProduct)
      }
    } else {
      retrievedProduct.variants.forEach((variant: any) => {
        // @ts-ignore
        const productQuantity = qrData.productsSummary![retrievedProduct.id][variant.id] || 0
        for (let i: number = 1; i <= productQuantity; i++){
          databaseProducts.push({...retrievedProduct, variant: variant})
        }
      })
    }
  })

  return databaseProducts
}

export const validateQr = (qrData: QrData) => {
  if (qrData.productsSummary === undefined)
    throw new Error('Koszyk klienta nie może być pusty')
  if (qrData.userId === undefined) throw new Error('Użytkownik nieprawidłowy')
}

export const validateProductsWithDatabase = (qrData: QrData, retrievedProducts: ProductType[]) => {
  if (
    retrievedProducts.length === 0 ||
    Object.keys(qrData.productsSummary!).length !== retrievedProducts.length
  )
    throw new Error('Brak niektórych produktów w bazie')
}

export const getUserTransactions = async (userId: string) => {
  const transactionsCollection = collection(firestore, 'transactions')
  const transactionsQuery = query(
    transactionsCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  )
  const transactionsSnapshot = await getDocs(transactionsQuery)

  if (transactionsSnapshot.docs.length === 0) return []

  const transactions = transactionsSnapshot.docs.map((transaction) => {
    const transactionData = Object.assign({ id: transaction.id }, transaction.data())
    return transactionData as Transaction
  })

  return transactions
}

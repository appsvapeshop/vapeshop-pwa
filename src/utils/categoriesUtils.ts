import { firestore } from '../configs/firebaseConfig'
import { Category as CategoryType } from '../types/Category'
import {
  getDocs,
  collection,
  doc,
  getDoc,
  updateDoc,
  addDoc,
  query,
  where,
  limit,
  deleteDoc
} from 'firebase/firestore'
import ValidationError from '../exceptions/ValidationError'

export const getCategories = async (): Promise<CategoryType[]> => {
  const categoriesCollections = collection(firestore, 'productCategories')
  const categoriesSnapshot = await getDocs(categoriesCollections)
  const categories = categoriesSnapshot.docs.map((category) => {
    const categoryData = Object.assign({ id: category.id }, category.data())
    return categoryData as CategoryType
  })
  return categories
}

export const getCategory = async (categoryId: string): Promise<CategoryType> => {
  const categorySnapshot = await getDoc(doc(firestore, 'productCategories', categoryId))
  if (categorySnapshot.exists()) {
    return Object.assign({ id: categorySnapshot.id }, categorySnapshot.data()) as CategoryType
  } else {
    throw new Error('Category does not exist')
  }
}

export const upsertCategory = async (category: CategoryType) => {
  const { id: _, ...values } = category
  if (!category.id) {
    await addDoc(collection(firestore, 'productCategories'), { ...values })
  } else {
    await updateDoc(doc(firestore, 'productCategories', category.id), {
      ...values
    })
  }
}

export const deleteCategory = async (categoryId: string) => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('category', '==', categoryId), limit(1))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length !== 0)
    throw new ValidationError('Kategoria ma przypisane produkty')

  await deleteDoc(doc(firestore, 'productCategories', categoryId))
}

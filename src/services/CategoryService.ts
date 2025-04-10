import CategoryNotFound from '../exceptions/CategoryNotFound'
import { firestore, storage } from '../configs/firebaseConfig'
import CategoryHasProducts from '../exceptions/CategoryHasProducts'
import { ProductCategory as CategoryType } from '../types/ProductCategory'

import { deleteObject, ref } from 'firebase/storage'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'

/**
 * Get all categories
 *
 * @return all categories
 */
export const getCategories = async (): Promise<CategoryType[]> => {
  const categoriesCollections = collection(firestore, 'productCategories')
  const categoriesSnapshot = await getDocs(categoriesCollections)
  return categoriesSnapshot.docs.map((category) => {
    const categoryData = Object.assign({ id: category.id }, category.data())
    return categoryData as CategoryType
  })
}

/**
 * Get category for given category ID
 *
 * @param categoryId. Must not be null
 *
 * @return category for given ID
 */
export const getCategory = async (categoryId: string): Promise<CategoryType> => {
  const categorySnapshot = await getDoc(doc(firestore, 'productCategories', categoryId))
  if (categorySnapshot.exists()) {
    return Object.assign({ id: categorySnapshot.id }, categorySnapshot.data()) as CategoryType
  } else {
    throw new CategoryNotFound()
  }
}

/**
 * Upsert given Category record
 *
 * @param category record. Must not be null
 */
export const upsertCategory = async (category: CategoryType) => {
  const { id: _, ...values } = category
  if (!category.id) {
    await addDoc(collection(firestore, 'productCategories'), {
      ...values,
      createDate: Timestamp.now()
    })
  } else {
    await updateDoc(doc(firestore, 'productCategories', category.id), {
      ...values,
      updateDate: Timestamp.now()
    })
  }
}

/**
 * Delete given Category and image assigned to this category
 *
 * @param category record. Must not be null
 */
export const deleteCategory = async (category: CategoryType) => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('category', '==', category.id), limit(1))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length !== 0) throw new CategoryHasProducts()

  if (category.img) {
    const categoryImage = ref(storage, category.img)
    await deleteObject(categoryImage)
  }

  await deleteDoc(doc(firestore, 'productCategories', category.id))
}

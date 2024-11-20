import { firestore } from '../configs/firebaseConfig'
import { Category as CategoryType } from '../types/Category'
import { getDocs, collection, doc, getDoc, updateDoc } from 'firebase/firestore'

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

export const updateCategory = async (category: CategoryType) => {
  await updateDoc(doc(firestore, 'productCategories', category.id), {
    img: category.img,
    name: category.name
  })
}

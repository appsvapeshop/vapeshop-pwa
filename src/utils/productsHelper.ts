import { firestore } from '../configs/firebaseConfig'
import { Product as ProductType } from '../types/Product'
import { CategoryContext } from '../enums/CategoryContext'
import { getDocs, collection, query, where, updateDoc, doc, addDoc } from 'firebase/firestore'

export const getAllProducts = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsSnapshot = await getDocs(productsCollection)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })

  return products
}

export const getCoupons = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('coupon', '==', true))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })

  return products
}

export const getNewspaperProducts = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('newspaper', '==', true))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })

  return products
}

export const getProductsByCategory = async (categoryName: string): Promise<ProductType[]> => {
  const categoryCollection = collection(firestore, 'productCategories')
  const categoryQuery = query(categoryCollection, where('name', '==', categoryName))
  const categorySnapshot = await getDocs(categoryQuery)

  if (categorySnapshot.docs.length !== 1) throw new Error('Category query - error occur')
  const categoryId = categorySnapshot.docs[0].id

  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('category', '==', categoryId))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })

  return products
}

export const getProductsGroupedByCategory = async (
  categoryContext: CategoryContext
): Promise<Map<string, ProductType[]>> => {
  const productsQuery = getProductQuery(categoryContext)
  const productsSnapshot = await getDocs(productsQuery)
  const products = productsSnapshot.docs.map((product) => product.data() as ProductType)
  const groupedByCategory = Map.groupBy(products, ({ category }) => category)
  return groupedByCategory
}

const getProductQuery = (categoryContext: CategoryContext) => {
  const productsCollection = collection(firestore, 'products')

  if (categoryContext === CategoryContext.Coupons) {
    return query(productsCollection, where('coupon', '==', true))
  } else {
    return query(productsCollection, where('newspaper', '==', true))
  }
}

export const getProductsById = async (productIds: string[]): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('__name__', 'in', productIds))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })

  return products
}

export const upsertProduct = async (product: ProductType) => {
  const { id: _, ...values } = product
  if (!!!product.id) {
    await addDoc(collection(firestore, 'products'), {...values})
  } else {
    await updateDoc(doc(firestore, 'products', product.id), {
      ...values
    })
  }
}

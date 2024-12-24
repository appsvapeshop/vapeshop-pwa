import { ref, deleteObject } from 'firebase/storage'
import { Product as ProductType } from '../types/Product'
import { CategoryContext } from '../enums/CategoryContext'
import { firestore, storage } from '../configs/firebaseConfig'
import { GroupedProducts as GroupedProductsType } from '../types/GroupedProducts'
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'

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

export const getProductsByCategory = async (categoryId: string): Promise<ProductType[]> => {
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
  const { id, ...values } = product
  if (!!!product.id) {
    await addDoc(collection(firestore, 'products'), { ...values, createDate: Timestamp.now() })
  } else {
    await updateDoc(doc(firestore, 'products', product.id), {
      ...values,
      updateDate: Timestamp.now()
    })
  }
}

export const deleteProduct = async (product: ProductType) => {
  if (!!product.img) {
    const categoryImage = ref(storage, product.img)
    await deleteObject(categoryImage)
  }

  await deleteDoc(doc(firestore, 'products', product.id))
}

export const groupProductsById = (products: ProductType[]): GroupedProductsType => {
  return products.reduce((accumulator, product) => {
    if (!accumulator[product.id]) {
      accumulator[product.id] = { product: product, size: 0 }
    }

    accumulator[product.id].size += 1
    return accumulator
  }, Object.assign({}))
}

export const getSavedProducts = () => {
  const products = JSON.parse(localStorage.getItem('cartProducts') as string)
  if (products) return products

  return []
}

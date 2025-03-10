import { deleteObject, ref } from 'firebase/storage'
import { ProductVariant } from '../types/ProductVariant'
import { Product as ProductType } from '../types/Product'
import { CategoryContext } from '../enums/CategoryContext'
import { firestore, storage } from '../configs/firebaseConfig'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  getDoc
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

export const getProductsWithVariants = async (productIds: string[]): Promise<any[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('__name__', 'in', productIds))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    return Object.assign({ id: product.id }, product.data())
  })

  for (const product of products) {
    product.variants = await getProductVariants(product.id);
  }

  return products
}

export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  const productReference = doc(firestore, 'products', productId)
  const variantsReference = collection(productReference, 'variants')
  const variantsSnapshot = await getDocs(variantsReference)

  if (variantsSnapshot.docs.length === 0) return []

  return variantsSnapshot.docs.map((variant) => {
    const variantData = Object.assign({ id: variant.id }, variant.data())
    return variantData as ProductVariant
  })
}

export const getProductVariant = async (productId: string, variantId: string): Promise<ProductVariant> => {
  const productReference = doc(firestore, 'products', productId)
  const variantReference = doc(productReference, 'variants', variantId)
  const variantSnapshot = await getDoc(variantReference)

  if (variantSnapshot.exists()) {
    return Object.assign({ id: variantSnapshot.id }, variantSnapshot.data()) as ProductVariant
  } else {
    throw new Error('Variant does not exist')
  }
}

export const upsertProductVariant = async (productId: string, productVariant: ProductVariant) => {
  const { id, ...values } = productVariant
  if (!productVariant.id && !!productId) {
    const productReference = doc(firestore, 'products', productId)
    await addDoc(collection(productReference, 'variants'), { ...values, createDate: Timestamp.now() })
  } else {
    const productReference = doc(firestore, 'products', productId)
    await updateDoc(doc(productReference, 'variants', productVariant.id), {
      ...values,
      updateDate: Timestamp.now()
    })
  }
}

export const deleteProductVariant = async (productId: string, productVariant: ProductVariant) => {
  const productReference = doc(firestore, 'products', productId)
  await deleteDoc(doc(productReference, 'variants', productVariant.id))
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

export const getProductById = async (productId: string): Promise<ProductType> => {
  const productReference = doc(firestore, 'products', productId)
  const productSnapshot = await getDoc(productReference)

  if (productSnapshot.exists()) {
    return Object.assign({ id: productSnapshot.id }, productSnapshot.data()) as ProductType
  } else {
    throw new Error('Variant does not exist')
  }
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

export const groupProductsByIdAndVariants = (products: ProductType[]): any => {
  return products.reduce((accumulator, product) => {
    if (!accumulator[product.id]) {
      accumulator[product.id] = { [product.variant?.id!]: { product: product, size: 1 } }
    } else {
      const variants = accumulator[product.id]
      if (variants[product.variant!.id]) {
        variants[product.variant!.id].size += 1
      } else {
        variants[product.variant!.id] = { product: product, size: 1 }
      }
    }

    return accumulator
  }, Object.assign({}))
}

export const getSavedProducts = () => {
  const products = JSON.parse(localStorage.getItem('cartProducts') as string)
  if (products) return products

  return []
}

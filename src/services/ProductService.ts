import { ProductVariant } from '../types/ProductVariant'
import { Product as ProductType } from '../types/Product'
import { CategoryContext } from '../enums/CategoryContext'
import ProductNotFound from '../exceptions/ProductNotFound'
import VariantNotFound from '../exceptions/VariantNotFound'

import { deleteObject, ref } from 'firebase/storage'
import { firestore, storage } from '../configs/firebaseConfig'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore'

/**
 * Get all products.
 *
 * @return all products.
 */
export const getProducts = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsSnapshot = await getDocs(productsCollection)

  if (productsSnapshot.docs.length === 0) return []

  return productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })
}

/**
 * Get Product for given product ID.
 *
 * @param productId. Must not be null.
 *
 * @return Product for given ID.
 */
export const getProductById = async (productId: string): Promise<ProductType> => {
  const productReference = doc(firestore, 'products', productId)
  const productSnapshot = await getDoc(productReference)

  if (productSnapshot.exists()) {
    return Object.assign({ id: productSnapshot.id }, productSnapshot.data()) as ProductType
  } else {
    throw new ProductNotFound()
  }
}

/**
 * Get Products for given product Ids.
 *
 * @param productIds. Must not be null.
 *
 * @return List of products for given Ids.
 */
export const getProductsById = async (productIds: string[]): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('__name__', 'in', productIds))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  return productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })
}

/**
 * Upsert given Product record.
 *
 * @param product record. Must not be null.
 */
export const upsertProduct = async (product: ProductType) => {
  const { id, ...values } = product
  if (!product.id) {
    await addDoc(collection(firestore, 'products'), { ...values, createDate: Timestamp.now() })
  } else {
    await updateDoc(doc(firestore, 'products', product.id), {
      ...values,
      updateDate: Timestamp.now()
    })
  }
}

/**
 * Delete given Product and image assigned to this Product.
 *
 * @param product record. Must not be null.
 */
export const deleteProduct = async (product: ProductType) => {
  if (product.img) {
    const image = ref(storage, product.img)
    await deleteObject(image)
  }

  await deleteDoc(doc(firestore, 'products', product.id))
}

/**
 * Get all products for given category Id.
 *
 * @param categoryId. Must not be null.
 *
 * @return all products for given category Id.
 */
export const getProductsByCategoryId = async (categoryId: string): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('category', '==', categoryId))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  return productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })
}

/**
 * Get all products for given Category Context and group them by category Id.
 *
 * @param categoryContext. Must not be null.
 *
 * @return all products for given Category Context and group them by category Id.
 */
export const getProductsForContextAndGroupedByCategory = async (
  categoryContext: CategoryContext
): Promise<Map<string, ProductType[]>> => {
  const productsQuery = getProductQuery(categoryContext)
  const productsSnapshot = await getDocs(productsQuery)
  const products = productsSnapshot.docs.map((product) => product.data() as ProductType)
  return Map.groupBy(products, ({ category }) => category)
}

/**
 * Get all products for given Ids with available product variants.
 *
 * @param productIds. Must not be null.
 *
 * @return all products for given Ids with available product variants.
 */
export const getProductsWithVariants = async (productIds: string[]): Promise<any[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('__name__', 'in', productIds))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  const products = productsSnapshot.docs.map((product) => {
    return Object.assign({ id: product.id }, product.data())
  })

  for (const product of products) {
    product.variants = await getProductVariants(product.id)
  }

  return products
}

/**
 * Get product variant for given product Id.
 *
 * @param productId. Must not be null.
 * @param variantId. Must not be null.
 *
 * @return product variant for given Id.
 */
export const getProductVariant = async (productId: string, variantId: string): Promise<ProductVariant> => {
  const productReference = doc(firestore, 'products', productId)
  const variantReference = doc(productReference, 'variants', variantId)
  const variantSnapshot = await getDoc(variantReference)

  if (variantSnapshot.exists()) {
    return Object.assign({ id: variantSnapshot.id }, variantSnapshot.data()) as ProductVariant
  } else {
    throw new VariantNotFound()
  }
}

/**
 * Get all product variants for given product Id.
 *
 * @param productId. Must not be null.
 *
 * @return all product variants for given Id.
 */
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

/**
 * Upsert given product variant record.
 *
 * @param productId. Must not be null.
 * @param productVariant. Must not be null.
 */
export const upsertProductVariant = async (productId: string, productVariant: ProductVariant) => {
  const { id, ...values } = productVariant
  if (!productVariant.id && productId) {
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

/**
 * Delete given product variant.
 *
 * @param productId. Must not be null.
 * @param productVariant. Must not be null.
 */
export const deleteProductVariant = async (productId: string, productVariant: ProductVariant) => {
  const productReference = doc(firestore, 'products', productId)
  await deleteDoc(doc(productReference, 'variants', productVariant.id))
}

/**
 * Get all products that are coupons. This products will be displayed in coupons tab
 *
 * @return all products that are coupons.
 */
export const getCoupons = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('coupon', '==', true))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  return productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })
}

/**
 * Get all products that are newspaper products. This products will be displayed in newspaper tab
 *
 * @return all products that are coupons.
 */
export const getNewspaperProducts = async (): Promise<ProductType[]> => {
  const productsCollection = collection(firestore, 'products')
  const productsQuery = query(productsCollection, where('newspaper', '==', true))
  const productsSnapshot = await getDocs(productsQuery)

  if (productsSnapshot.docs.length === 0) return []

  return productsSnapshot.docs.map((product) => {
    const productData = Object.assign({ id: product.id }, product.data())
    return productData as ProductType
  })
}

/**
 * Method return query object depending on given context.
 *
 * @param categoryContext. Must not be null.
 *
 * @return query object related to given context.
 */
const getProductQuery = (categoryContext: CategoryContext) => {
  const productsCollection = collection(firestore, 'products')

  if (categoryContext === CategoryContext.Coupons) {
    return query(productsCollection, where('coupon', '==', true))
  } else {
    return query(productsCollection, where('newspaper', '==', true))
  }
}

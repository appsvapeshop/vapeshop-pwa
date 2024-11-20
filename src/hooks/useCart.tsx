import { useState, useEffect } from 'react'
import { Product as ProductType } from '../types/Product'

const getSavedProducts = () => {
  const products = JSON.parse(localStorage.getItem('cartProducts') as string)
  if (products) return products

  return []
}

export default function useCart() {
  const [products, setProducts] = useState(() => {
    return getSavedProducts()
  })

  useEffect(() => {
    localStorage.setItem('cartProducts', JSON.stringify(products))
  }, [products])

  const addProduct = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) => [
      ...previous,
      { ...product, timestamp: Date.now() }
    ])
  }

  const removeProduct = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) =>
      previous.filter((previousProduct) => previousProduct.timestamp !== product.timestamp)
    )
  }

  return { cartProducts: products, addProduct: addProduct, removeProduct: removeProduct }
}

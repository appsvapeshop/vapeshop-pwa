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
    setProducts((previous: Array<ProductType>) => [...previous, product])
  }

  const removeProduct = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) =>
      previous.filter((previousProduct) => previousProduct.id !== product.id)
    )
  }

  const increment = (product: ProductType) => {
    addProduct(product)
  }

  const decrement = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) => {
      const productIndex = previous.findIndex(
        (previousProduct) => previousProduct.id === product.id
      )
      previous.splice(productIndex, 1)
      return previous
    })
  }

  const clearCart = () => {
    localStorage.removeItem('cartProducts')
    setProducts([])
  }

  return {
    cartProducts: products,
    addProduct: addProduct,
    removeProduct: removeProduct,
    increment: increment,
    decrement: decrement,
    clearCart: clearCart
  }
}

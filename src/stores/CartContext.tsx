import { Product as ProductType } from '../types/Product'
import { getSavedProducts } from '../utils/ProductUtils'
import { CartContext as CartContextType } from '../types/CartContext'
import React, { createContext, useState, useEffect, useContext } from 'react'

/**
 * Cart Context. Is null before initialization
 */
const CartContext = createContext<CartContextType | null>(null)

/**
 * Cart Context Provider. Provides the user cart and useful cart management functions
 */
const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState(() => getSavedProducts())

  /**
   * Set in local storage loaded user cart products
   */
  useEffect(() => {
    localStorage.setItem('cartProducts', JSON.stringify(products))
  }, [products])

  /**
   * Add given product to cart
   *
   * @param product which will be added to the cart
   */
  const addProduct = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) => [...previous, product])
  }

  /**
   * Remove given product to cart
   *
   * @param product which will be removed from the cart
   */
  const removeProduct = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) =>
      previous.filter((previousProduct) => previousProduct.id !== product.id)
    )
  }

  /**
   * Increase quantity of given product
   *
   * @param product which will be increased
   */
  const increaseQuantity = (product: ProductType) => {
    addProduct(product)
  }

  /**
   * Reduce quantity of given product
   *
   * @param product which will be increased
   */
  const reduceQuantity = (product: ProductType) => {
    setProducts((previous: Array<ProductType>) => {
      const productIndex = previous.findIndex((previousProduct) => previousProduct.id === product.id)
      previous.splice(productIndex, 1)
      return [...previous]
    })
  }

  /**
   * Remove all products from the carrt
   */
  const clearCart = () => {
    localStorage.removeItem('cartProducts')
    setProducts([])
  }

  const contextValue = {
    products: products,
    addProduct: addProduct,
    removeProduct: removeProduct,
    increaseQuantity: increaseQuantity,
    reduceQuantity: reduceQuantity,
    clearCart: clearCart
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export default CartContextProvider

/**
 * Custom hook for Cart Context
 */
export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider')
  }
  return context
}

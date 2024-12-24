import { Product as ProductType } from '../types/Product'
import { createContext, useState, useEffect } from 'react'
import { CartContext as CartContextType } from '../types/CartContext'

const CartContext = createContext<CartContextType | null>(null)

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<ProductType[]>([])

  useEffect(() => {
    setProducts(getSavedProducts())
  }, [])

  const getSavedProducts = () => {
    const products = JSON.parse(localStorage.getItem('cartProducts') as string)
    if (products) return products

    return []
  }

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

  const contextValue = {
    products: products,
    addProduct: addProduct,
    removeProduct: removeProduct,
    increment: increment,
    decrement: decrement,
    clearCart: clearCart
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export default CartContextProvider

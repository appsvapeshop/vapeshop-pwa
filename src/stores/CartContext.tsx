import { Product as ProductType } from '../types/Product'
import { getSavedProducts } from '../utils/productsHelper'
import { CartContext as CartContextType } from '../types/CartContext'
import { createContext, useState, useEffect, useContext } from 'react'

const CartContext = createContext<CartContextType | null>(null)

const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState(() => getSavedProducts())

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
      return [...previous]
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
    increaseQuantity: increment,
    reduceQuantity: decrement,
    clearCart: clearCart
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export default CartContextProvider

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsContextProvider')
  }
  return context
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from './ManageProducts.module.css'
import { getProducts } from '../../services/ProductService'

import { AnimatedPage } from '../Cart/cartComponents'
import Product from '../../components/Product/Product'
import AddCard from '../../components/ui/AddCard/AddCard'
import ProductSkeleton from '../../components/skeletons/ProductSkeleton/ProductSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'

/**
 * Display all available Products and AddCard for creating new Product.
 */
const ManageProducts = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductType[]>()

  /**
   * Fetch all Products.
   */
  useEffect(() => {
    getProducts()
      .then((snapshot) => setProducts(snapshot))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        )}
        {!isLoading && (
          <>
            <AddCard onClick={() => navigate('new')} />
            {products?.map((product) => (
              <TappedComponent key={product.id} onClick={() => navigate(product.id)}>
                <Product product={product} context={ProductContext.Manage} />
              </TappedComponent>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageProducts

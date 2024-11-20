import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from './ManageProducts.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import Product from '../../components/Product/Product'
import AddCard from '../../components/ui/AddCard/AddCard'
import { getAllProducts } from '../../utils/productsHelper'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import LoadingProduct from '../../components/skeletons/LoadingProduct/LoadingProduct'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageProducts = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductType[]>()

  useEffect(() => {
    getAllProducts()
      .then((snapshot) => setProducts(snapshot))
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <>
            <LoadingProduct />
            <LoadingProduct />
            <LoadingProduct />
          </>
        )}
        {!isLoading && (
          <>
            <AddCard onClick={() => navigate('new')}/>
            {products?.map((product) => (
              <TappedComponent key={product.id} onClick={() => navigate(product.id)}>
                <Product data={product} context={ProductContext.Manage} />
              </TappedComponent>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageProducts

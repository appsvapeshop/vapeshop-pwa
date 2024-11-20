import { useEffect, useState } from 'react'
import classes from './Newspaper.module.css'
import { useParams } from 'react-router-dom'
import Product from '../../components/Product/Product'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'
import Categories from '../../components/Categories/Categories'
import { useSettingsContext } from '../../stores/SettingsContext'
import LoadingProduct from '../../components/skeletons/LoadingProduct/LoadingProduct'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import { getProductsByCategory, getNewspaperProducts } from '../../utils/productsHelper'

const Newspaper = () => {
  const { categoryName } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const { categoriesForNewspaper } = useSettingsContext()
  const [products, setProducts] = useState<ProductType[]>()

  useEffect(() => {
    if (categoryName === undefined && !categoriesForNewspaper) {
      getNewspaperProducts()
        .then((productsSnapshot) => setProducts(productsSnapshot))
        .finally(() => setIsLoading(false))
    } else if (categoryName !== undefined) {
      getProductsByCategory(categoryName)
        .then((productsSnapshot) => setProducts(productsSnapshot))
        .finally(() => setIsLoading(false))
    }
  }, [categoryName, categoriesForNewspaper])

  if (categoriesForNewspaper && categoryName === undefined)
    return <Categories context={CategoryContext.Newspaper} />

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

        {!isLoading && products?.length === 0 && (
          <span className={classes['no-products']}>Brak produktów</span>
        )}

        {!isLoading &&
          products?.map((product) => (
            <Product key={product.id} data={product} context={ProductContext.Newspaper} />
          ))}
      </div>
    </AnimatedPage>
  )
}

export default Newspaper

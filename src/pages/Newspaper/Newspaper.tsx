import { useEffect, useState } from 'react'
import classes from './Newspaper.module.css'
import { useParams } from 'react-router-dom'
import { useSettingsContext } from '../../stores/SettingsContext'
import { getProductsByCategoryId, getNewspaperProducts } from '../../services/ProductService'

import Product from '../../components/Product/Product'
import Categories from '../../components/Categories/Categories'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import ProductSkeleton from '../../components/skeletons/ProductSkeleton/ProductSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'

/**
 * Display all available Newspaper products. Is launched in two modes:
 *
 * <ul>
 *     <li>When categories are enabled for Newspaper, it displays all available Newspaper product categories.
 *     If a category is selected, it will display all products related to it</li>
 *     <li>when categories are disabled for Newspaper, it displays all available Newspaper products.</li>
 * </ul>
 */
const Newspaper = () => {
  const { categoryId } = useParams()
  const { settings } = useSettingsContext()

  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<ProductType[]>([])

  /**
   * <ul>
   *     <li>If categoryId is empty and categoriesForNewspaper is false, then query all products</li>
   *     <li>If categoryId is not empty, then query products related to this category</li>
   * </ul>
   */
  useEffect(() => {
    if (!categoryId && !settings.categoriesForNewspaper) {
      getNewspaperProducts()
        .then((productsSnapshot) => setProducts(productsSnapshot))
        .finally(() => setIsLoading(false))
    } else if (categoryId !== undefined) {
      getProductsByCategoryId(categoryId)
        .then((productsSnapshot) => setProducts(productsSnapshot))
        .finally(() => setIsLoading(false))
    }
  }, [categoryId, settings.categoriesForNewspaper])

  if (settings.categoriesForNewspaper && !categoryId) return <Categories context={CategoryContext.Newspaper} />

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

        {!isLoading && products?.length === 0 && <span className={classes['no-products']}>Brak produktów</span>}

        {!isLoading && (
          <>
            {products.map((product) => (
              <TappedComponent key={product.id}>
                <Product product={product} context={ProductContext.Newspaper} />
              </TappedComponent>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default Newspaper

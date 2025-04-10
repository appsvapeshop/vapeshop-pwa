import classes from './Coupons.module.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSettingsContext } from '../../stores/SettingsContext'
import { getCoupons, getProductsByCategoryId } from '../../services/ProductService'

import Product from '../../components/Product/Product'
import Categories from '../../components/Categories/Categories'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import ProductSkeleton from '../../components/skeletons/ProductSkeleton/ProductSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'

/**
 * Display all available coupons. Is launched in two modes:
 *
 * <ul>
 *     <li>When categories are enabled for coupons, it displays all available coupon categories.
 *     If a category is selected, it will display all products related to it</li>
 *     <li>when categories are disabled for coupons, it displays all available coupons.</li>
 * </ul>
 */
const Coupons = () => {
  const { categoryId } = useParams()
  const { settings } = useSettingsContext()
  const navigation = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [coupons, setCoupons] = useState<ProductType[]>([])

  /**
   * <ul>
   *     <li>If categoryId is empty and categoriesForCoupons is false, then query all products</li>
   *     <li>If categoryId is not empty, then query products related to this category</li>
   * </ul>
   */
  useEffect(() => {
    if (!categoryId && !settings.categoriesForCoupons) {
      getCoupons()
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    } else if (categoryId) {
      getProductsByCategoryId(categoryId)
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    }
  }, [categoryId, settings.categoriesForCoupons])

  if (settings.categoriesForCoupons && !categoryId) return <Categories context={CategoryContext.Coupons} />

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
            {coupons.map((coupon) => (
              <TappedComponent key={coupon.id} onClick={() => navigation(`/product/${coupon.id}`)}>
                <Product product={coupon} context={ProductContext.Coupons} />
              </TappedComponent>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default Coupons

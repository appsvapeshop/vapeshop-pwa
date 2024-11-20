import useCart from '../../hooks/useCart'
import classes from './Coupons.module.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from '../../components/Product/Product'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'
import Categories from '../../components/Categories/Categories'
import { useSettingsContext } from '../../stores/SettingsContext'
import LoadingProduct from '../../components/skeletons/LoadingProduct/LoadingProduct'
import { getCoupons, getProductsByCategory } from '../../utils/productsHelper'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'

const Coupons = () => {
  const { addProduct } = useCart()
  const { categoryName } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const { categoriesForCoupons } = useSettingsContext()
  const [coupons, setCoupons] = useState<ProductType[]>([])

  useEffect(() => {
    if (categoryName === undefined && !categoriesForCoupons) {
      getCoupons()
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    } else if (categoryName !== undefined) {
      getProductsByCategory(categoryName)
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    }
  }, [categoryName, categoriesForCoupons])

  if (categoriesForCoupons && categoryName === undefined)
    return <Categories context={CategoryContext.Coupons} />

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
            {coupons.map((coupon) => (
              <Product
                key={coupon.id}
                data={coupon}
                context={ProductContext.Coupons}
                addHandler={addProduct}
              />
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default Coupons

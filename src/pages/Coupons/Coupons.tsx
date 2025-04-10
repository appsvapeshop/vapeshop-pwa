import classes from './Coupons.module.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Product from '../../components/Product/Product'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'
import Categories from '../../components/Categories/Categories'
import { useSettingsContext } from '../../stores/SettingsContext'
import LoadingProduct from '../../components/skeletons/LoadingProduct/LoadingProduct'
import { getCoupons, getProductsByCategory } from '../../utils/productsHelper'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const Coupons = () => {
  const { categoryId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const { categoriesForCoupons } = useSettingsContext()
  const [coupons, setCoupons] = useState<ProductType[]>([])
  const navigation = useNavigate()

  useEffect(() => {
    if (categoryId === undefined && !categoriesForCoupons) {
      getCoupons()
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    } else if (categoryId !== undefined) {
      getProductsByCategory(categoryId)
        .then((productsSnapshot) => setCoupons(productsSnapshot))
        .finally(() => setIsLoading(false))
    }
  }, [categoryId, categoriesForCoupons])

  if (categoriesForCoupons && categoryId === undefined)
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
              <TappedComponent key={coupon.id} onClick={() => navigation(`/product/${coupon.id}`)}>
                <Product
                  data={coupon}
                  context={ProductContext.Coupons}
                />
              </TappedComponent>
            ))}
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default Coupons

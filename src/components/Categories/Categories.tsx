import { useEffect, useState } from 'react'
import classes from './Categories.module.css'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../services/CategoryService'
import { getProductsForContextAndGroupedByCategory } from '../../services/ProductService'

import Category from '../Category/Category'
import AnimatedPage from '../animations/AnimatedPage/AnimatedPage'
import CardSkeleton from '../skeletons/CardSkeleton/CardSkeleton'

import ErrorOccurred from '../../exceptions/ErrorOccurred'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'

/**
 * Display all available product categories
 *
 * @param context is component displayed for coupons or for newspaper. Must not be null.
 */
const Categories = ({ context }: { context: CategoryContext }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryType[]>()
  const [productsByCategory, setProductsByCategory] = useState<Map<string, ProductType[]>>()

  useEffect(() => {
    /**
     * Initialize all required data by component
     */
    const initialize = async () => {
      const categories = await getCategories()
      setCategories(categories)

      const productsByCategory = await getProductsForContextAndGroupedByCategory(context)
      setProductsByCategory(productsByCategory)

      setIsLoading(false)
    }

    initialize().catch(() => {
      throw new ErrorOccurred()
    })
  }, [context])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        )}

        {!isLoading && categories?.length === 0 && <span className={classes['no-category']}>Brak kategorii</span>}

        {!isLoading &&
          categories?.map((category) => (
            <Category
              category={category}
              key={category.id}
              itemsLength={productsByCategory?.get(category.id)?.length ?? 0}
              onClick={() => {
                navigate(category.id)
              }}
            />
          ))}
      </div>
    </AnimatedPage>
  )
}

export default Categories

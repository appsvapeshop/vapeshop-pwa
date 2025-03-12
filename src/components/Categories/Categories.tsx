import Category from '../Category/Category'
import { useEffect, useState } from 'react'
import classes from './Categories.module.css'
import { useNavigate } from 'react-router-dom'
import { getCategories } from '../../services/CategoryService'
import { Product as ProductType } from '../../types/Product'
import { CategoryContext } from '../../enums/CategoryContext'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'
import LoadingCategory from '../skeletons/LoadingCategory/LoadingCategory'
import AnimatedPage from '../animations/AnimatedPage/AnimatedPage'
import { getProductsGroupedByCategory } from '../../utils/productsHelper'

const Categories = ({ context }: { context: CategoryContext }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<CategoryType[]>()
  const [productsByCategory, setProductsByCategory] = useState<Map<string, ProductType[]>>()

  useEffect(() => {
    const getData = async () => {
      const categoriesSnapshot = await getCategories()
      const productsSnapshot = await getProductsGroupedByCategory(context)
      setCategories(categoriesSnapshot)
      setProductsByCategory(productsSnapshot)
      setIsLoading(false)
    }

    getData()
  }, [context])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <>
            <LoadingCategory />
            <LoadingCategory />
            <LoadingCategory />
          </>
        )}

        {!isLoading && categories?.length === 0 && (
          <span className={classes['no-category']}>Brak kategorii</span>
        )}

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

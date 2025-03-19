import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import classes from './ManageCategories.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import Category from '../../components/Category/Category'
import AddCard from '../../components/ui/AddCard/AddCard'
import { getCategories } from '../../services/CategoryService'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'
import LoadingCategory from '../../components/skeletons/LoadingCategory/LoadingCategory'

const ManageCategories = () => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryType[]>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getCategories()
      .then((snapshot) => {
        setCategories(snapshot)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

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

        {!isLoading && <AddCard onClick={() => navigate('new')} />}

        {!isLoading &&
          categories?.map((category) => (
            <Category
              category={category}
              key={category.id}
              onClick={() => {
                navigate(category.id)
              }}
            />
          ))}
      </div>
    </AnimatedPage>
  )
}

export default ManageCategories

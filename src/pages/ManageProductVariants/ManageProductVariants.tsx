import { Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import classes from './ManageProductVariants.module.css'
import AddCard from '../../components/ui/AddCard/AddCard'
import { ProductVariant } from '../../types/ProductVariant'
import { getProductVariants } from '../../utils/productsHelper'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageProductVariants = () => {
  const { productId } = useParams()
  const navigation = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [variants, setVariants] = useState<ProductVariant[]>([])

  useEffect(() => {
    getProductVariants(productId!)
      .then((variantsSnapshot) => setVariants(variantsSnapshot))
      .catch((error) => console.log(error))
      .finally(() => {
        setIsLoading(false)
      })
  }, [productId])

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.skeletons}>
          {[...Array(3)].map((_element, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}

      {!isLoading && (
        <>
          <AddCard className={classes['add-card']} onClick={() => navigation('new')} />
          {variants.map((variant, index) => (
            <TappedComponent key={index} className={classes.variant} onClick={() => navigation(variant.id)}>
              {variant.name}
            </TappedComponent>
          ))}
        </>
      )}
    </div>
  )
}

export default ManageProductVariants

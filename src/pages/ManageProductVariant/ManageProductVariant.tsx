import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import Button from '../../components/ui/Button/Button'
import classes from './ManageProductVariant.module.css'
import { useParams, useNavigate } from 'react-router-dom'
import { ProductVariant } from '../../types/ProductVariant'
import TextField from '../../components/ui/TextField/TextField'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import { deleteProductVariant, upsertProductVariant, getProductVariant } from '../../utils/productsHelper'

const ManageProductVariant = () => {
  const navigate = useNavigate()
  const { variantId, productId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [variant, setVariant] = useState<ProductVariant>()
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  useEffect(() => {
    if (variantId !== 'new') {
      getProductVariant(productId!, variantId!)
        .then((variantSnapshot) => setVariant(variantSnapshot))
        .catch((error) => {
          console.log(error)
          toast.dismiss()
          toast.error('Coś poszło nie tak')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [variantId])

  const save = () => {
    setIsButtonLoading(true)
    toast.dismiss()

    if (!variant?.name) {
      toast.error('Nazwa wariantu nie może być pusta')
      return
    }

    upsertProductVariant(productId!, variant)
      .then(() => {
        toast.success('Zapisano')
        navigate(-1)
      })
      .catch(() => {
        toast.error('Coś poszło nie tak')
      })
      .finally(() => setIsButtonLoading(false))
  }

  const remove = async () => {
    //TODO
    setIsButtonLoading(true)
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <div className={classes.skeletons}>
            {[...Array(3)].map((_element, index) => (
              <InputSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && (
          <>
            <TextField
              label="Wariant"
              value={variant?.name}
              onChange={(event) => {
                setVariant((prev) => {
                  return { ...prev, name: event.target.value } as ProductVariant
                })
              }}
            />

            <div className={classes['buttons']}>
              <Button onClick={save} colorVariant="primary" styles={{ height: '2.5rem' }}>
                {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
              </Button>

              {variantId !== 'new' && (
                <Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
                  {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Usuń'}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageProductVariant

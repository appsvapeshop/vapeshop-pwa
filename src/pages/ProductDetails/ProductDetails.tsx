import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import classes from './ProductDetails.module.css'
import { useCartContext } from '../../stores/CartContext'
import { getProductById, getProductVariants } from '../../services/ProductService'

import { Skeleton } from '@mui/material'
import Button from '../../components/ui/Button/Button'
import Picklist from '../../components/ui/Picklist/Picklist'
import LazyImage from '../../components/ui/LazyImage/LazyImage'

import { ProductVariant } from '../../types/ProductVariant'
import { Product as ProductType } from '../../types/Product'

/**
 * Display selected Product details e.g. available variants. It also gives ability to add product to the cart.
 */
const ProductDetails = () => {
  const { productId } = useParams()
  const { addProduct } = useCartContext()

  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<ProductType>()
  const [variants, setVariants] = useState<ProductVariant[]>([])

  /**
   * Fetch Product record and available variants for given Product Id.
   */
  useEffect(() => {
    getProductById(productId!)
      .then((productSnapshot) => {
        setProduct(productSnapshot)
        return getProductVariants(productId!)
      })
      .then((variantsSnapshot) => {
        setVariants(variantsSnapshot)
      })
      .finally(() => setIsLoading(false))
  }, [productId])

  /**
   * Validate data and add product to cart.
   */
  const onAdd = () => {
    if (variants && variants.length > 0 && (!product?.variant || !product.variant.name)) {
      toast.error('Wybierz wariant')
      return
    }

    toast.dismiss()
    toast.success('Produkt dodany')
    addProduct(product!)
  }

  return (
    <div className={classes.container}>
      {isLoading && (
        <div className={classes.skeletons}>
          <Skeleton variant="rounded" style={{ height: '13rem' }} />
          <Skeleton variant="rounded" style={{ margin: '0 2rem', height: '2rem' }} />
          <Skeleton variant="rounded" style={{ margin: '0 2rem', height: '2rem' }} />
          <Skeleton variant="rounded" style={{ margin: '0 2rem', height: '2rem' }} />
        </div>
      )}

      {!isLoading && product && (
        <>
          <LazyImage
            url={product.img}
            containerStyles={{ height: '13rem' }}
            styles={{
              maxHeight: '100%',
              maxWidth: '100%',
              height: 'auto',
              width: 'auto',
              borderRadius: '20px'
            }}
            cacheProperties={{ cacheStorageName: 'products-image' }}
          />

          <div className={classes.description}>
            <p className={classes.brand}>{product.brand}</p>
            <h1 className={classes.name}>{product.name}</h1>
          </div>

          <div className={classes.value}>
            <p>
              {product.points} pkt {product.mixedPrice && `+ ${product.mixedPrice} zł`}
            </p>
            <p>
              <b>Kwota</b>
            </p>
          </div>

          {variants && variants.length > 0 && (
            <Picklist
              label="Wariant"
              value={product?.variant?.id}
              options={variants?.map((variant) => {
                return { name: variant.name, value: variant.id }
              })}
              onChange={(event) =>
                setProduct((prev) => {
                  const variant = variants.find((e) => e.id === event.target.value)
                  return {
                    ...prev,
                    variant: { id: event.target.value, name: variant?.name }
                  } as ProductType
                })
              }
            />
          )}

          <div className={classes['buttons']}>
            <Button onClick={onAdd} colorVariant="primary" styles={{ height: '2.5rem' }}>
              Dodaj do koszyka
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductDetails

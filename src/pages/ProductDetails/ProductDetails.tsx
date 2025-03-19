import classes from './ProductDetails.module.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Product as ProductType } from '../../types/Product'
import { getProductById, getProductVariants } from '../../services/ProductService'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { Skeleton } from '@mui/material'
import { useCartContext } from '../../stores/CartContext'
import Button from '../../components/ui/Button/Button'
import Picklist from '../../components/ui/Picklist/Picklist'
import { ProductVariant } from '../../types/ProductVariant'
import {toast} from 'react-toastify'

const ProductDetails = () => {
  const { productId } = useParams()
  const { addProduct } = useCartContext()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<ProductType>()
  const [variants, setVariants] = useState<ProductVariant[]>([])

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

  const onAdd = () => {
    if(variants && variants.length > 0 && (!product?.variant || !product.variant.name )){
      toast.error('Wybierz wariant')
      return
    }

    toast.dismiss()
    toast.success('Produkt dodany')
    addProduct(product!);
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
                return { name: variant.name, value: variant.id}
              })}
              onChange={(event) =>
                setProduct((prev) => {
                  const variant = variants.find(e => e.id === event.target.value)
                  return { ...prev, variant: {id: event.target.value, name: variant?.name} } as ProductType
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

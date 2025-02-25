import { FC } from 'react'
import { IoClose } from 'react-icons/io5'
import classes from './ProductsList.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import NumberField from '../ui/NumberField/NumberField'
import { useCartContext } from '../../stores/CartContext'
import { Product as ProductType } from '../../types/Product'
import { groupProductsByIdAndVariants } from '../../utils/productsHelper'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

type Props = {
  products: ProductType[]
  readOnly?: boolean
  removeHandler?: (product: ProductType) => void
}

const ListProduct: FC<Props> = ({ products, removeHandler, readOnly = false }) => {
  const groupedProducts = groupProductsByIdAndVariants(products)
  const { increaseQuantity, reduceQuantity } = useCartContext()

  return Object.keys(groupedProducts)
    .sort()
    .map((productId: string) => {
      return Object.keys(groupedProducts[productId]).map((variantId) => (
        <div className={classes.container} key={variantId}>
          <div className={classes['image-container']}>
            <LazyImage url={groupedProducts[productId][variantId].product.img} containerStyles={{ minHeight: 100 }} />
          </div>
          <div className={classes['product-description']}>
            <span className={classes.brand}>{groupedProducts[productId][variantId].product.brand}</span>
            <span className={classes.name}>
              {groupedProducts[productId][variantId].product.name}
              {groupedProducts[productId][variantId].product.variant &&
                ` ( ${groupedProducts[productId][variantId].product.variant?.name} )`}
            </span>
            <span className={classes.value}>
              {groupedProducts[productId][variantId].product.points} pkt{' '}
              {groupedProducts[productId][variantId].product.mixedPrice !== undefined &&
                groupedProducts[productId][variantId].product.mixedPrice !== null &&
                groupedProducts[productId][variantId].product.mixedPrice !== 0 &&
                ` + ${groupedProducts[productId][variantId].product.mixedPrice} zł`}
            </span>
            <NumberField
              value={groupedProducts[productId][variantId].size}
              styles={{ margin: '10px 0' }}
              slotProps={{
                htmlInput: { style: { textAlign: 'center' } },
                input: { style: { height: '2rem' } }
              }}
              readOnly={readOnly}
              decrementHandler={() => {
                reduceQuantity(groupedProducts[productId][variantId].product)
              }}
              incrementHandler={() => {
                increaseQuantity(groupedProducts[productId][variantId].product)
              }}
            />
          </div>

          {removeHandler !== undefined && (
            <TappedComponent scale={0.8}>
              <IoClose
                color="var(--inactive-icon-color)"
                size="2rem"
                onClick={() => removeHandler(groupedProducts[productId][variantId].product)}
              />
            </TappedComponent>
          )}
        </div>
      ))
    })
}

export default ListProduct

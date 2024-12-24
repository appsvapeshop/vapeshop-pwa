import { FC } from 'react'
import { IoClose } from 'react-icons/io5'
import classes from './ProductsList.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import NumberField from '../ui/NumberField/NumberField'
import { useCartContext } from '../../stores/CartContext'
import { Product as ProductType } from '../../types/Product'
import { groupProductsById } from '../../utils/productsHelper'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

type Props = {
  products: ProductType[]
  readOnly?: boolean
  removeHandler?: (product: ProductType) => void
}

const ListProduct: FC<Props> = ({ products, removeHandler, readOnly = false }) => {
  const groupedProducts = groupProductsById(products)
  const { increment, decrement } = useCartContext()

  return Object.keys(groupedProducts).sort().map((productId: string, index: number) => (
    <div className={classes.container} key={`product${index}`}>
      <div className={classes['image-container']}>
        <LazyImage
          url={groupedProducts[productId].product.img}
          containerStyles={{ minHeight: 100 }}
        />
      </div>
      <div className={classes['product-description']}>
        <span className={classes.brand}>{groupedProducts[productId].product.brand}</span>
        <span className={classes.name}>{groupedProducts[productId].product.name}</span>
        <span className={classes.value}>
          {groupedProducts[productId].product.points} pkt{' '}
          {groupedProducts[productId].product.mixedPrice !== undefined &&
            groupedProducts[productId].product.mixedPrice !== null &&
            groupedProducts[productId].product.mixedPrice !== 0 &&
            ` + ${groupedProducts[productId].product.mixedPrice} zł`}
        </span>
        <NumberField
          value={groupedProducts[productId].size}
          styles={{ margin: '10px 0' }}
          slotProps={{
            htmlInput: { style: { textAlign: 'center' } },
            input: { style: { height: '2rem' } }
          }}
          readOnly={readOnly}
          decrementHandler={() => {
            decrement(groupedProducts[productId].product)
          }}
          incrementHandler={() => {
            increment(groupedProducts[productId].product)
          }}
        />
      </div>

      {removeHandler !== undefined && (
        <TappedComponent scale={0.8}>
          <IoClose
            color="var(--inactive-icon-color)"
            size="2rem"
            onClick={() => removeHandler(groupedProducts[productId].product)}
          />
        </TappedComponent>
      )}
    </div>
  ))
}

export default ListProduct

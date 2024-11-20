import { FC } from 'react'
import { IoClose } from 'react-icons/io5'
import classes from './ListProduct.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { Product as ProductType } from '../../types/Product'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

type Props = {
  product: ProductType
  removeHandler?: (product: ProductType) => void
}
const ListProduct: FC<Props> = ({ product, removeHandler }) => {
  return (
    <div className={classes.container}>
      <div className={classes['image-container']}>
        <LazyImage url={product.img} containerStyles={{ minHeight: 100 }} />
      </div>
      <div className={classes['product-description']}>
        <span className={classes.brand}>{product.brand}</span>
        <span className={classes.name}>{product.name}</span>
        <span className={classes.value}>
          {product.points} pkt{' '}
          {product.mixedPrice !== undefined &&
            product.mixedPrice !== null &&
            product.mixedPrice !== 0 &&
            ` + ${product.mixedPrice} zł`}
        </span>
      </div>

      {removeHandler !== undefined && (
        <TappedComponent scale={0.8}>
          <IoClose
            color="var(--inactive-icon-color)"
            size="2rem"
            onClick={() => removeHandler(product)}
          />
        </TappedComponent>
      )}
    </div>
  )
}

export default ListProduct

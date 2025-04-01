import { FC } from 'react'
import classes from './Product.module.css'
import 'react-toastify/dist/ReactToastify.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'

type Props = {
  product: ProductType
  context: ProductContext
}

/**
 * Component that displays the product and its details depending on context.
 *
 * @param product data. Must not be null.
 * @param context for which context Product component is displayed. Must not be null.
 */
const Product: FC<Props> = ({ product, context }) => {
  return (
    <div className={classes.container}>
      <LazyImage
        url={product.img}
        containerStyles={{ minHeight: '150px' }}
        cacheProperties={{ cacheStorageName: 'products-image' }}
      />
      <span className={classes.brand}>{product.brand}</span>
      <span className={classes.name}>{product.name}</span>

      {context === ProductContext.Coupons && (
        <>
          <span className={classes.value}>
            {product.points} pkt
            {!!product.mixedPrice && `+ ${product.mixedPrice} zł`}
          </span>
        </>
      )}

      {context === ProductContext.Newspaper && (
        <>
          <span className={classes.value}>
            {!!product.promoPrice && (
              <>
                <s>{product.price} zł</s>
                <span> - {product.promoPrice} zł</span>
              </>
            )}

            {!product.promoPrice && <span>{product.price} zł</span>}
          </span>
        </>
      )}

      {context === ProductContext.Manage && (
        <>
          <span className={classes.value}>
            {product.points} pkt
            {!!product.mixedPrice && ` + ${product.mixedPrice} zł`}
          </span>
          <span className={classes.value}>
            {!!product.promoPrice && (
              <>
                <s>{product.price} zł</s>
                <span> - {product.promoPrice} zł</span>
              </>
            )}

            {!product.promoPrice && <span>{product.price} zł</span>}
          </span>
        </>
      )}
    </div>
  )
}

export default Product

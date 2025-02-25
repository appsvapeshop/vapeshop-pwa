import { FC } from 'react'
import classes from './Product.module.css'
import 'react-toastify/dist/ReactToastify.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { ProductContext } from '../../enums/ProductContext'
import { Product as ProductType } from '../../types/Product'

type Props = {
  data: ProductType
  context: ProductContext
  addHandler?: (product: ProductType) => void
}

const Product: FC<Props> = ({ data, context }) => {
  return (
      <div className={classes.container}>
        <LazyImage
          url={data.img}
          containerStyles={{ minHeight: '150px' }}
          cacheProperties={{ cacheStorageName: 'products-image' }}
        />
        <span className={classes.brand}>{data.brand}</span>
        <span className={classes.name}>{data.name}</span>

        {context === ProductContext.Coupons && (
          <>
          <span className={classes.value}>
            {data.points} pkt
            {!!data.mixedPrice && `+ ${data.mixedPrice} zł`}
          </span>
          </>
        )}

        {context === ProductContext.Newspaper && (
          <>
          <span className={classes.value}>
            {!!data.promoPrice && (
              <>
                <s>{data.price} zł</s>
                <span> - {data.promoPrice} zł</span>
              </>
            )}

            {!!!data.promoPrice && <span>{data.price} zł</span>}
          </span>
          </>
        )}

        {context === ProductContext.Manage && (
          <>
          <span className={classes.value}>
            {data.points} pkt
            {!!data.mixedPrice && ` + ${data.mixedPrice} zł`}
          </span>
            <span className={classes.value}>
            {!!data.promoPrice && (
              <>
                <s>{data.price} zł</s>
                <span> - {data.promoPrice} zł</span>
              </>
            )}

              {!!!data.promoPrice && <span>{data.price} zł</span>}
          </span>
          </>
        )}
      </div>
  )
}

export default Product

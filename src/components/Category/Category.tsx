import { FC } from 'react'
import classes from './Category.module.css'

import { TbDiamondsFilled } from 'react-icons/tb'
import LazyImage from '../ui/LazyImage/LazyImage'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

import { ProductCategory as CategoryType } from '../../types/ProductCategory'

type Props = {
  category: CategoryType
  itemsLength?: number
  onClick?: () => void
}

/**
 * Product Category tile displayed in Categories component
 *
 * @param category. Must not be null.
 * @param itemsLength how many products are in this category. May be null.
 * @param onClick event when tile is clicked. May be null.
 */
const Category: FC<Props> = ({ category, itemsLength, onClick = () => {} }) => {
  return (
    <TappedComponent onClick={onClick} className={classes.container}>
      <div className={classes['image-container']}>
        <LazyImage url={category.img} cacheProperties={{ cacheStorageName: 'category-image' }} />
      </div>
      <div className={classes.description}>
        <span className={classes.name}>{category.name}</span>
        <div className={classes.count}>
          <TbDiamondsFilled size={15} />
          <span className={classes['count-label']}>{itemsLength || 0}</span>
        </div>
      </div>
    </TappedComponent>
  )
}

export default Category

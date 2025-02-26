import { FC } from 'react'
import classes from './Category.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { TbDiamondsFilled } from 'react-icons/tb'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

type Props = {
  category: CategoryType
  itemsLength?: number
  onClick?: () => void
}

const Category: FC<Props> = ({ category, itemsLength, onClick = () => {} }) => {
  return (
    <TappedComponent onClick={onClick} className={classes.container}>
      <div className={classes['image-container']}>
        <LazyImage url={category.img} cacheProperties={{ cacheStorageName: 'category-image' }} />
      </div>
      <div className={classes.description}>
        <span className={classes.name}>{category.name}</span>
        {itemsLength !== undefined && (
          <div className={classes.count}>
            <TbDiamondsFilled size={15} />
            <span className={classes['count-label']}>{itemsLength}</span>
          </div>
        )}
      </div>
    </TappedComponent>
  )
}

export default Category

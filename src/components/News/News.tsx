import classes from './News.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { News as NewsType } from '../../types/News'
import TappedComponent from '../animations/TappedComponent/TappedComponent'
import { FC } from 'react'

type Props = {
  data: NewsType,
  onClick: () => void
}

const News:FC<Props> = ({ data, onClick = () => {}}) => {
  return (
    <TappedComponent className={classes.container} onClick={onClick}>
      <LazyImage
        url={data.img}
        containerStyles={{ minHeight: '150px' }}
        styles={{ boxShadow: '0px 4px 10px -4px rgba(66, 68, 90, 1)' }}
      />
    </TappedComponent>
  )
}

export default News

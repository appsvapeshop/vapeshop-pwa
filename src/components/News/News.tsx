import { FC } from 'react'
import classes from './News.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { News as NewsType } from '../../types/News'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

type Props = {
  news: NewsType
  onClick: () => void
}

/**
 * News tile displayed on home page.
 *
 * @param news data. Must not be null.
 * @param onClick event. Must not be null.
 */
const News: FC<Props> = ({ news, onClick = () => {} }) => {
  return (
    <TappedComponent className={classes.container} onClick={onClick}>
      <LazyImage
        url={news.img}
        containerStyles={{ minHeight: '150px' }}
        styles={{ boxShadow: '0px 4px 10px -4px rgba(66, 68, 90, 1)' }}
      />
    </TappedComponent>
  )
}

export default News

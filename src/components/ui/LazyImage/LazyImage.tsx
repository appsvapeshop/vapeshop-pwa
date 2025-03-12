import { FC } from 'react'
import { useState } from 'react'
import classes from './LazyImage.module.css'
import useCachedImage from '../../../hooks/useCachedImage'
import { ImageCacheProperties } from '../../../types/ImageCacheProperties'

type Props = {
  url: string
  styles?: React.CSSProperties
  containerStyles?: React.CSSProperties
  cacheProperties?: ImageCacheProperties
}

const LazyImage: FC<Props> = ({ url, styles = {}, containerStyles = {}, cacheProperties }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const { cacheLoaded, imageSource } = useCachedImage(url, cacheProperties)

  return (
    <div
      className={`${classes.container} ${isLoading ? classes.pulse : classes.loaded}`}
      style={containerStyles}
    >
      {cacheLoaded && !errorOccurred && (
        <img
          alt=""
          className={classes['lazy-image']}
          style={styles}
          src={imageSource}
          onLoad={(e) => {
            setIsLoading(false)
            e.currentTarget.classList.add(`${classes.show}`)
          }}
          onError={() => setErrorOccurred(true)}
          onContextMenu={(e) => {
            e.preventDefault()
            return false
          }}
        />
      )}
    </div>
  )
}

export default LazyImage

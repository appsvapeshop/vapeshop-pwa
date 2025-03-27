import React, { FC, useState } from 'react'
import classes from './LazyImage.module.css'
import useCachedImage from '../../../hooks/useCachedImage'
import { ImageCacheProperties } from '../../../types/ImageCacheProperties'

type Props = {
  url: string
  styles?: React.CSSProperties
  containerStyles?: React.CSSProperties
  cacheProperties?: ImageCacheProperties
}

/**
 * If cache properties have been provided then
 *
 * <ul>
 *     <li>Image exist in cache storage, load from it</li>
 *     <li>Image don't exist in cache storage, then save in cache and load image</li>
 * </ul>
 *
 * If cache properties haven't been provided then load image without cache storage logic
 *
 * @param url image URL. Must not be null.
 * @param styles image CSS styles. May be null.
 * @param containerStyles container CSS styles. May be null.
 * @param cacheProperties all properties required to save image in cache storage. May be null.
 */
const LazyImage: FC<Props> = ({ url, styles = {}, containerStyles = {}, cacheProperties }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [errorOccurred, setErrorOccurred] = useState(false)
  const { cacheLoaded, imageSource } = useCachedImage(url, cacheProperties)

  return (
    <div className={`${classes.container} ${isLoading ? classes.pulse : classes.loaded}`} style={containerStyles}>
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

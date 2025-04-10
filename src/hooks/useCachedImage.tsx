import { sha1 } from 'js-sha1'
import { useState, useEffect } from 'react'
import { getFileData } from '../utils/FileUtils'

import ErrorOccurred from '../exceptions/ErrorOccurred'
import { ImageCacheProperties } from '../types/ImageCacheProperties'

/**
 * Custom Hook that loads an image from cache for a given url and ImageCacheProperties
 * or if it doesn't exist in the cache then it adds it to it.
 *
 * <ul>
 *   <li>If ImageCacheProperties is not provided then assign url as image source</li>
 *   <li>ImageCacheProperties is used for grouping images into storages.</li>
 *   <li>The provided URL is encoded in SHA-1 format to obtain a short unique hashcode.</li>
 * </ul>
 *
 * @param url image url. Must not be null.
 * @param cacheProperties for which the image will be loaded. May be null.
 *
 * @return loaded image source and loading status (cacheLoaded)
 */
const useCachedImage = (url: string, cacheProperties: ImageCacheProperties | undefined) => {
  const [imageSource, setImageSource] = useState(url)
  const [cacheLoaded, setCacheLoaded] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      if (!cacheProperties || !url) return

      const cache = await caches.open(cacheProperties.cacheStorageName)
      const imageHash = sha1(url)
      const cachedData = await cache.match(imageHash)

      if (!cachedData) {
        const imageData = await getFileData(url)
        await cache.put(`/${imageHash}`, new Response(imageData as string))
      } else {
        const imageData = await cachedData.text()
        setImageSource(imageData)
      }

      setCacheLoaded(true)
    }

    if (cacheProperties) {
      loadImage().catch(() => {
        throw new ErrorOccurred()
      })
    } else {
      setImageSource(url)
      setCacheLoaded(true)
    }
  }, [url, cacheProperties])

  return { cacheLoaded: cacheLoaded, imageSource: imageSource }
}

export default useCachedImage

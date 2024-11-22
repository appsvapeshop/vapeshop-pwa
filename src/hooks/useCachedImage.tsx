import { useState, useEffect } from 'react'
import { ImageCacheProperties } from '../types/ImageCacheProperties'
import { sha1 } from 'js-sha1'
import { getImageData } from '../utils/getImageData'

const useCachedImage = (url: string, cacheProperties: ImageCacheProperties | undefined) => {
  const [imgSrc, setImgSrc] = useState(url)
  const [cacheLoaded, setCacheLoaded] = useState(false)

  useEffect(() => {
    const loadImage = async () => {
      if (cacheProperties === undefined || url === undefined) return

      const cache = await caches.open(cacheProperties.cacheStorageName)
      const imageHash = sha1(url)
      const cachedData = await cache.match(imageHash)

      if (cachedData === undefined) {
        const imageData = await getImageData(url)
        cache.put(`/${imageHash}`, new Response(imageData as string))
      } else {
        const imageData = await cachedData.text()
        setImgSrc(imageData)
      }
      setCacheLoaded(true)
    }

    if (cacheProperties !== undefined) {
      loadImage()
    } else {
      setImgSrc(url)
      setCacheLoaded(true)
    }

  
  }, [url, cacheProperties])

  return { cacheLoaded: cacheLoaded, imgSrc: imgSrc }
}

export default useCachedImage

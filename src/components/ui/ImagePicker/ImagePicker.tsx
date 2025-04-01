import AddCard from '../AddCard/AddCard'
import classes from './ImagePicker.module.css'
import LazyImage from '../LazyImage/LazyImage'
import React, { FC, useRef, useState } from 'react'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  imageUrl?: string
  cacheStorageName: string
  onChange: (imageData: Blob) => void
}

/**
 * Component which allows to upload image from the device. If cache storage name provided then image can be stored in
 * cache storage. If image URL is provided then image is displayed.
 *
 * @param imageUrl. May be null.
 * @param cacheStorageName for which cache storage image should be assigned.
 * @param onChange event handler which will be run with new image Blob as a param. Must not be null.
 */
const ImagePicker: FC<Props> = ({ imageUrl, cacheStorageName, onChange }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [changedData, setChangedData] = useState<Blob>()

  /**
   * On image change event handler. Set new selected data and call given onChange event handler.
   */
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 1) {

      setChangedData(event.target.files[0])
      onChange(event.target.files[0])
    }
  }

  return (
    <div className={classes.container}>
      <input ref={ref} type="file" accept="image/*" onChange={onImageChange} hidden />

      {!!imageUrl || !!changedData ? (
        <TappedComponent styles={{ height: '100%' }} onClick={() => ref.current!.click()}>
          <LazyImage
            containerStyles={{ height: '100%' }}
            url={!!changedData ? URL.createObjectURL(changedData) : imageUrl!}
            cacheProperties={!!changedData ? undefined : { cacheStorageName: cacheStorageName }}
          />
        </TappedComponent>
      ) : (
        <AddCard onClick={() => ref.current!.click()} />
      )}
    </div>
  )
}

export default ImagePicker

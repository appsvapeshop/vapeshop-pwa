import AddCard from '../AddCard/AddCard'
import { FC, useRef, useState } from 'react'
import classes from './ImagePicker.module.css'
import LazyImage from '../LazyImage/LazyImage'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

type Props = {
  imageUrl?: string
  cacheStorageName: string
  onChange: (imageData: Blob) => void
}

const ImagePicker: FC<Props> = ({ imageUrl, cacheStorageName, onChange }) => {
  const ref = useRef<HTMLInputElement>(null)
  const [changedData, setChangedData] = useState<Blob>()

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

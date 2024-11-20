import classes from './ManageNewsItem.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { News as NewsType } from '../../types/News'
import { Skeleton } from '@mui/material'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import { getNewsById } from '../../utils/newsHelper'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import AddCard from '../../components/ui/AddCard/AddCard'
import TextField from '@mui/material/TextField'
import Button from '../../components/ui/Button/Button'
import PulseLoader from 'react-spinners/PulseLoader'




const ManageNewsItem = () => {
  const { newsId } = useParams()
  const imageRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageData, setImageData] = useState<Blob>()
  const [isLoading, setIsLoading] = useState(true)
  const [imageChanged, setImageChanged] = useState(false)
  const [news, setNews] = useState<NewsType>()

  useEffect(() => {
    if (newsId !== 'new') {
      getNewsById(newsId!)
        .then((newsSnapshot) => {
          setNews(newsSnapshot)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [newsId])

  const save = async () => {
    setIsSaving(true)
  }

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length === 1) {
      setImageData(event.target.files[0])
      setImageChanged(true)
    }
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <div className={classes.skeletons}>
            <Skeleton variant="rounded" height={160}/>
            {[...Array(3)].map((_element, index) => (
              <InputSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && (
          <>
            <div className={classes.image}>
              <input ref={imageRef} type="file" accept="image/*" onChange={onImageChange} hidden />

              {!!news?.img || !!imageData ? (
                <TappedComponent
                  styles={{ height: '100%' }}
                  onClick={() => imageRef.current?.click()}
                >
                  <LazyImage
                    containerStyles={{ height: '100%'}}
                    url={imageChanged ? URL.createObjectURL(imageData!) : news!.img}
                    cacheProperties={
                      imageChanged ? undefined : { cacheStorageName: 'products-image' }
                    }
                  />
                </TappedComponent>
              ) : (
                <AddCard onClick={() => imageRef.current?.click()} />
              )}
            </div>

            <TextField
              className={classes.input}
              label="Tytuł"
              variant="outlined"
              color="secondary"
              type="text"
              value={news?.title || ''}
              onChange={(event) =>
                setNews((prev) => {
                  return { ...prev, title: event.target.value } as NewsType
                })
              }
            />

            <Button
              containerStyle={{
                margin: '2rem 0',
                position: 'sticky',
                bottom: '6rem',
                display: 'flex',
                justifyContent: 'center'
              }}
              styles={{
                width: '80%',
                height: '2.5rem'
              }}
              onClick={save}
            >
              {isSaving ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
            </Button>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageNewsItem

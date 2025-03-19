import { toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import classes from './ManageNewsItem.module.css'
import { useState, useEffect, useRef } from 'react'
import { News as NewsType } from '../../types/News'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import { uploadFile } from '../../services/FileService'
import Button from '../../components/ui/Button/Button'
import { useParams, useNavigate } from 'react-router-dom'
import AddCard from '../../components/ui/AddCard/AddCard'
import ValidationException from '../../exceptions/ValidationException'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { getNewsById, upsertNews, deleteNews } from '../../services/NewsService'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageNewsItem = () => {
  const { newsId } = useParams()
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsType>()
  const imageRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [imageData, setImageData] = useState<Blob>()
  const [imageChanged, setImageChanged] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

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
    setIsButtonLoading(true)
    toast.dismiss()

    try {
      if (imageChanged) {
        const dataUrl = await uploadFile(imageData!, `news/${Date.now()}`)
        await upsertNews({ ...news, img: dataUrl } as NewsType)
      } else {
        await upsertNews(news!)
      }
      toast.success('Zapisano')
      navigate('/admin/panel/manageNews')
    } catch (error) {
      if (error instanceof ValidationException) {
        toast.error(error.message)
      } else {
        toast.error('Coś poszło nie tak')
      }
    }

    setIsButtonLoading(false)
  }

  const remove = async () => {
    setIsButtonLoading(true)
    toast.dismiss()

    deleteNews(news!)
      .then(() => {
        toast.success('Wiadomość usunięta')
        navigate('/admin/panel/manageNews')
      })
      .catch(() => {
        toast.error('Coś poszło nie tak')
      })
      .finally(() => {
        setIsButtonLoading(false)
      })
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
            <Skeleton variant="rounded" height={160} />
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
                    containerStyles={{ height: '100%' }}
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

            <div className={classes.buttons}>
              <Button onClick={save} colorVariant="primary" styles={{ height: '2.5rem' }}>
                {isButtonLoading ? (
                  <PulseLoader size=".6rem" color="var(--primary-font-color)" />
                ) : (
                  'Zapisz'
                )}
              </Button>

              {newsId !== 'new' && (
                <Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
                  {isButtonLoading ? (
                    <PulseLoader size=".6rem" color="var(--primary-font-color)" />
                  ) : (
                    'Usuń'
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageNewsItem

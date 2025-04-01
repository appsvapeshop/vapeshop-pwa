import { toast } from 'react-toastify'
import classes from './ManageNewsItem.module.css'
import { uploadFile } from '../../services/FileService'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { getNewsById, upsertNews, deleteNews } from '../../services/NewsService'

import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import AddCard from '../../components/ui/AddCard/AddCard'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

import { News as NewsType } from '../../types/News'
import ValidationException from '../../exceptions/ValidationException'

/**
 * Display News configuration page for given News ID or if News ID is equal "new",
 * create new News record.
 */
const ManageNewsItem = () => {
  const { newsId } = useParams()
  const navigate = useNavigate()
  const imageRef = useRef<HTMLInputElement>(null)

  const [news, setNews] = useState<NewsType>()
  const [isLoading, setIsLoading] = useState(true)
  const [imageData, setImageData] = useState<Blob>()
  const [imageChanged, setImageChanged] = useState(false)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  /**
   * If News ID is provided, fetch News record from database.
   */
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

  /**
   * Upload ( if needed ) image and upsert News record.
   */
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

  /**
   * Remove News record and navigate to Manage News page.
   */
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

  /**
   * When image is changed for Category, set "imageData" and "imageChanged".
   */
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
                <TappedComponent styles={{ height: '100%' }} onClick={() => imageRef.current?.click()}>
                  <LazyImage
                    containerStyles={{ height: '100%' }}
                    url={imageChanged ? URL.createObjectURL(imageData!) : news!.img}
                    cacheProperties={imageChanged ? undefined : { cacheStorageName: 'products-image' }}
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
                {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
              </Button>

              {newsId !== 'new' && (
                <Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
                  {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Usuń'}
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

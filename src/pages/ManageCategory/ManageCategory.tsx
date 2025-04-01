import { toast } from 'react-toastify'
import classes from './ManageCategory.module.css'
import { uploadFile } from '../../services/FileService'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect, useRef } from 'react'
import { getCategory, upsertCategory, deleteCategory } from '../../services/CategoryService'

import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import AddCard from '../../components/ui/AddCard/AddCard'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

import ValidationException from '../../exceptions/ValidationException'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'
import ErrorOccurred from '../../exceptions/ErrorOccurred'

/**
 * Display Category configuration page for given Category ID or if Category ID is equal "new",
 * create new Category record.
 */
const ManageCategory = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const imageRef = useRef<HTMLInputElement>(null)

  const [imageData, setImageData] = useState<Blob>()
  const [isLoading, setIsLoading] = useState(true)
  const [imageChanged, setImageChanged] = useState(false)
  const [category, setCategory] = useState<CategoryType>()
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  /**
   * If Category ID is provided, fetch Category record from database.
   */
  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getCategory(categoryId as string)
      setCategory(category)
      setIsLoading(false)
    }

    if (categoryId !== 'new') {
      fetchCategory().catch(() => {
        throw new ErrorOccurred()
      })
    } else {
      setIsLoading(false)
    }
  }, [categoryId])

  /**
   * Upload ( if needed ) image and upsert Category record.
   */
  const save = async () => {
    setIsButtonLoading(true)
    toast.dismiss()

    try {
      if (imageChanged) {
        const dataUrl = await uploadFile(imageData!, `categories/${Date.now()}`)
        await upsertCategory({ ...category, img: dataUrl } as CategoryType)
      } else {
        await upsertCategory(category!)
      }
      toast.success('Zapisano')
      navigate('/admin/panel/manageCategories')
    } catch (error) {
      toast.error('Coś poszło nie tak')
    }

    setIsButtonLoading(false)
  }

  /**
   * Remove Category record and navigate to Manage Categories page.
   */
  const remove = async () => {
    setIsButtonLoading(true)
    toast.dismiss()

    deleteCategory(category!)
      .then(() => {
        toast.success('Kategoria usunięta')
        navigate('/admin/panel/manageCategories')
      })
      .catch((error) => {
        if (error instanceof ValidationException) {
          toast.error(error.message)
        } else {
          toast.error('Coś poszło nie tak')
        }
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
            <InputSkeleton />
          </div>
        )}

        {!isLoading && (
          <>
            <div className={classes.image}>
              <input ref={imageRef} type="file" accept="image/*" onChange={onImageChange} hidden />

              {!!category?.img || !!imageData ? (
                <TappedComponent styles={{ height: '100%' }} onClick={() => imageRef.current?.click()}>
                  <LazyImage
                    containerStyles={{ height: '100%' }}
                    url={imageChanged ? URL.createObjectURL(imageData!) : category!.img}
                    cacheProperties={imageChanged ? undefined : { cacheStorageName: 'category-image' }}
                  />
                </TappedComponent>
              ) : (
                <AddCard onClick={() => imageRef.current?.click()} />
              )}
            </div>
            <TextField
              className={classes.input}
              label="Nazwa"
              variant="outlined"
              color="secondary"
              type="text"
              value={category?.name || ''}
              onChange={(event) =>
                setCategory((prev) => {
                  return { ...prev, name: event.target.value } as CategoryType
                })
              }
            />
          </>
        )}
      </div>

      <div className={classes.buttons}>
        <Button onClick={save} colorVariant="primary" styles={{ height: '2.5rem' }}>
          {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
        </Button>

        {categoryId !== 'new' && (
          <Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
            {isButtonLoading ? <PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Usuń'}
          </Button>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageCategory

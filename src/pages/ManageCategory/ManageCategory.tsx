import { toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import classes from './ManageCategory.module.css'
import { useState, useEffect, useRef } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import { uploadFile } from '../../services/FileService'
import { useParams, useNavigate } from 'react-router-dom'
import AddCard from '../../components/ui/AddCard/AddCard'
import ValidationException from '../../exceptions/ValidationException'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import { getCategory, upsertCategory, deleteCategory } from '../../services/CategoryService'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageCategory = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const imageRef = useRef<HTMLInputElement>(null)
  const [isButtonLoading, setIsButtonLoading] = useState(false)
  const [imageData, setImageData] = useState<Blob>()
  const [isLoading, setIsLoading] = useState(true)
  const [imageChanged, setImageChanged] = useState(false)
  const [category, setCategory] = useState<CategoryType>()

  useEffect(() => {
    const fetchCategory = async () => {
      const category = await getCategory(categoryId as string)
      setCategory(category)
      setIsLoading(false)
    }

    if (categoryId !== 'new') {
      fetchCategory()
    } else {
      setIsLoading(false)
    }
  }, [categoryId])

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

  const changeImage = () => {
    imageRef.current?.click()
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
            <InputSkeleton />
          </div>
        )}

        {!isLoading && (
          <>
            <div className={classes.image}>
              <input ref={imageRef} type="file" accept="image/*" onChange={onImageChange} hidden />

              {!!category?.img || !!imageData ? (
                <TappedComponent styles={{ height: '100%' }} onClick={changeImage}>
                  <LazyImage
                    containerStyles={{ height: '100%' }}
                    url={imageChanged ? URL.createObjectURL(imageData!) : category!.img}
                    cacheProperties={
                      imageChanged ? undefined : { cacheStorageName: 'category-image' }
                    }
                  />
                </TappedComponent>
              ) : (
                <AddCard onClick={changeImage} />
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
          {isButtonLoading ? (
            <PulseLoader size=".6rem" color="var(--primary-font-color)" />
          ) : (
            'Zapisz'
          )}
        </Button>

        {categoryId !== 'new' && (
          <Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
            {isButtonLoading ? (
              <PulseLoader size=".6rem" color="var(--primary-font-color)" />
            ) : (
              'Usuń'
            )}
          </Button>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ManageCategory

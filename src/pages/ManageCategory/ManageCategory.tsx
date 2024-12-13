import { toast } from 'react-toastify'
import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import classes from './ManageCategory.module.css'
import { useState, useEffect, useRef } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import { uploadFile } from '../../utils/filesUploader'
import { useParams, useNavigate } from 'react-router-dom'
import AddCard from '../../components/ui/AddCard/AddCard'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { Category as CategoryType } from '../../types/Category'
import { getCategory, upsertCategory } from '../../utils/categoriesUtils'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ManageCategory = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams()
  const imageRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
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
    setIsSaving(true)
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

    setIsSaving(false)
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
    </AnimatedPage>
  )
}

export default ManageCategory

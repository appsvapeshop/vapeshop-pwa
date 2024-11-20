import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import classes from './ManageProduct.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import { Product as ProductType } from '../../types/Product'
import { getProductsById } from '../../utils/productsHelper'
import { Skeleton } from '@mui/material'
import TextField from '@mui/material/TextField'
import Button from '../../components/ui/Button/Button'
import PulseLoader from 'react-spinners/PulseLoader'
import AddCard from '../../components/ui/AddCard/AddCard'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { getCategories } from '../../utils/categoriesUtils'
import { Category as CategoryType } from '../../types/Category'
import {
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { upsertProduct } from '../../utils/productsHelper'
import { uploadFile } from '../../utils/filesUploader'
import { toast } from 'react-toastify'

const ManageProduct = () => {
  const { productId } = useParams()
  const imageRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageData, setImageData] = useState<Blob>()
  const [isLoading, setIsLoading] = useState(true)
  const [imageChanged, setImageChanged] = useState(false)
  const [product, setProduct] = useState<ProductType>()
  const [categories, setCategories] = useState<CategoryType[]>()

  useEffect(() => {
    if (productId !== 'new') {
      getProductsById([productId!])
        .then((productSnapshot) => {
          setProduct(productSnapshot[0])
          return getCategories()
        })
        .then((categoriesSnapshot) => {
          setCategories(categoriesSnapshot)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      getCategories()
        .then((categoriesSnapshot) => {
          setCategories(categoriesSnapshot)
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [productId])

  const save = async () => {
    setIsSaving(true)
    try {
      if (imageChanged) {
        const dataUrl = await uploadFile(imageData!, `products/${Date.now()}`)
        await upsertProduct({ ...product, img: dataUrl } as ProductType)
      } else {
        await upsertProduct(product!)
      }
      toast.dismiss()
      toast.success('Zapisano')
    } catch (error) {
      toast.dismiss()
      toast.success('Coś poszło nie tak')
    }

    setIsSaving(false)
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

              {!!product?.img || !!imageData ? (
                <TappedComponent
                  styles={{ height: '100%' }}
                  onClick={() => imageRef.current?.click()}
                >
                  <LazyImage
                    containerStyles={{ height: '100%' }}
                    url={imageChanged ? URL.createObjectURL(imageData!) : product!.img}
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
              label="Marka"
              variant="outlined"
              color="secondary"
              type="text"
              value={product?.brand || ''}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, brand: event.target.value } as ProductType
                })
              }
            />

            <TextField
              className={classes.input}
              label="Nazwa"
              variant="outlined"
              color="secondary"
              type="text"
              value={product?.name || ''}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, name: event.target.value } as ProductType
                })
              }
            />

            <FormControl color="secondary" className={classes.input}>
              <InputLabel>Kategoria</InputLabel>
              <Select
                label="Kategoria"
                value={product?.category || ''}
                onChange={(event) =>
                  setProduct((prev) => {
                    return { ...prev, category: event.target.value } as ProductType
                  })
                }
                MenuProps={{
                  sx: {
                    '&& .Mui-selected': {
                      backgroundColor: 'rgba(0,0,0,0.1)'
                    }
                  }
                }}
              >
                <MenuItem key="empty-category"></MenuItem>

                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              className={classes.input}
              label="Punkty"
              variant="outlined"
              color="secondary"
              type="number"
              slotProps={{ input: { endAdornment: 'pkt' } }}
              value={product?.points}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, points: Number(event.target.value) } as ProductType
                })
              }
            />

            <TextField
              className={classes.input}
              label="Cena"
              variant="outlined"
              color="secondary"
              type="number"
              value={product?.price}
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, price: Number(event.target.value) } as ProductType
                })
              }
            />

            <TextField
              className={classes.input}
              label="Cena promocyjna"
              variant="outlined"
              color="secondary"
              type="number"
              value={product?.promoPrice}
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, promoPrice: Number(event.target.value) } as ProductType
                })
              }
            />

            <TextField
              className={classes.input}
              label="Cena mieszana"
              variant="outlined"
              color="secondary"
              type="number"
              value={product?.mixedPrice}
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, mixedPrice: Number(event.target.value) } as ProductType
                })
              }
            />

            <FormControlLabel
              labelPlacement="top"
              label="Kupon"
              control={
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  color="secondary"
                  checked={product?.coupon}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProduct((prev) => {
                      return { ...prev, coupon: event.target.checked } as ProductType
                    })
                  }}
                />
              }
            />

            <FormControlLabel
              labelPlacement="top"
              label="Gazetka"
              control={
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  color="secondary"
                  checked={product?.newspaper}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setProduct((prev) => {
                      return { ...prev, coupon: event.target.checked } as ProductType
                    })
                  }}
                />
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

export default ManageProduct

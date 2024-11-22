import * as Types from './types'
import * as Components from './components'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import classes from './ManageProduct.module.css'
import ManageProductSkeleton from './ManageProductSkeleton'
import { uploadFile, getCategories, getProductsById, upsertProduct } from './utils'

const ManageProduct = () => {
  const { productId } = useParams()

  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  const [changedImage, setChangedImage] = useState<Blob>()
  const [product, setProduct] = useState<Types.ProductType>()
  const [categories, setCategories] = useState<Types.CategoryType[]>()

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
      if (!!changedImage) {
        const dataUrl = await uploadFile(changedImage, `products/${Date.now()}`)
        await upsertProduct({ ...product, img: dataUrl } as Types.ProductType)
      } else {
        await upsertProduct(product!)
      }
      toast.dismiss()
      toast.success('Zapisano')
    } catch (error) {
      toast.dismiss()
      toast.error('Coś poszło nie tak')
    }

    setIsSaving(false)
  }

  return (
    <Components.AnimatedPage>
      <div className={classes.container}>
        {isLoading && <ManageProductSkeleton />}

        {!isLoading && (
          <>
            <Components.ImagePicker
              onChange={(imageData) => setChangedImage(imageData)}
              cacheStorageName="products-image"
              imageUrl={product?.img}
            />

            <Components.TextField
              label="Marka"
              value={product?.brand}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, brand: event.target.value } as Types.ProductType
                })
              }
            />

            <Components.TextField
              label="Nazwa"
              value={product?.name}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, name: event.target.value } as Types.ProductType
                })
              }
            />

            <Components.Picklist
              label="Kategoria"
              value={product?.category}
              options={
                !!categories
                  ? categories?.map((category) => {
                      return { name: category.name, value: category.id }
                    })
                  : []
              }
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, category: event.target.value } as Types.ProductType
                })
              }
            />

            <Components.TextField
              label="Punkty"
              value={product?.points}
              type="number"
              slotProps={{ input: { endAdornment: 'pkt' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, points: Number(event.target.value) } as Types.ProductType
                })
              }
            />

            <Components.TextField
              label="Cena"
              value={product?.points}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, price: Number(event.target.value) } as Types.ProductType
                })
              }
            />

            <Components.TextField
              label="Cena promocyjna"
              value={product?.points}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, promoPrice: Number(event.target.value) } as Types.ProductType
                })
              }
            />

            <Components.TextField
              label="Cena mieszana"
              value={product?.points}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, mixedPrice: Number(event.target.value) } as Types.ProductType
                })
              }
            />

            <Components.Checkbox
              label="Kupon"
              checked={!!product?.coupon}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProduct((prev) => {
                  return { ...prev, coupon: event.target.checked } as Types.ProductType
                })
              }}
            />

            <Components.Checkbox
              label="Gazetka"
              checked={!!product?.coupon}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProduct((prev) => {
                  return { ...prev, newspaper: event.target.checked } as Types.ProductType
                })
              }}
            />

            <div className={classes['buttons']}>
              <Components.Button onClick={save} colorVariant="primary">
                {isSaving ? (
                  <Components.PulseLoader size=".6rem" color="var(--primary-font-color)" />
                ) : (
                  'Zapisz'
                )}
              </Components.Button>

              <Components.Button onClick={save} colorVariant="error">
                {isDeleting ? (
                  <Components.PulseLoader size=".6rem" color="var(--primary-font-color)" />
                ) : (
                  'Usuń'
                )}
              </Components.Button>
            </div>
          </>
        )}
      </div>
    </Components.AnimatedPage>
  )
}

export default ManageProduct

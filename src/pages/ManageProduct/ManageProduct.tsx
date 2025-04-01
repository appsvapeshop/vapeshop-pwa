import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import classes from './ManageProduct.module.css'
import { uploadFile } from '../../services/FileService'
import { useParams, useNavigate } from 'react-router-dom'
import { getCategories } from '../../services/CategoryService'
import { getProductsById, upsertProduct, deleteProduct } from '../../services/ProductService'

import * as Components from './components'
import ManageProductSkeleton from './ManageProductSkeleton'

import { Product as ProductType } from '../../types/Product'
import { ProductCategory as CategoryType } from '../../types/ProductCategory'

/**
 * Display Product configuration page for given Product ID or if Product ID is equal "new",
 * create new Product record.
 */
const ManageProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [isButtonLoading, setIsButtonLoading] = useState(false)

  const [changedImage, setChangedImage] = useState<Blob>()
  const [product, setProduct] = useState<ProductType>()
  const [categories, setCategories] = useState<CategoryType[]>()

  /**
   * If Category ID is provided, fetch Category record from database and all categories.
   * If not provided then just fetch all categories.
   */
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

  /**
   * Upload ( if needed ) image and upsert Product record.
   */
  const save = async () => {
    setIsButtonLoading(true)
    toast.dismiss()

    try {
      if (!!changedImage) {
        const dataUrl = await uploadFile(changedImage, `products/${Date.now()}`)
        await upsertProduct({ ...product, img: dataUrl } as ProductType)
      } else {
        await upsertProduct(product!)
      }

      toast.success('Zapisano')
      navigate('/admin/panel/manageProducts')
    } catch (error) {
      toast.error('Coś poszło nie tak')
    }

    setIsButtonLoading(false)
  }

  /**
   * Remove Category record and navigate to Manage Products page.
   */
  const remove = async () => {
    setIsButtonLoading(true)
    toast.dismiss()

    deleteProduct(product!)
      .then(() => {
        toast.success('Produkt usunięty')
        navigate('/admin/panel/manageProducts')
      })
      .catch(() => {
        toast.error('Coś poszło nie tak')
      })
      .finally(() => {
        setIsButtonLoading(false)
      })
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
                  return { ...prev, brand: event.target.value } as ProductType
                })
              }
            />

            <Components.TextField
              label="Nazwa"
              value={product?.name}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, name: event.target.value } as ProductType
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
                  return { ...prev, category: event.target.value || '' } as ProductType
                })
              }
            />

            <Components.Button
              onClick={() => {
                navigate('variants')
              }}
              colorVariant="secondary"
              variant="outlined"
              styles={{ margin: 0, height: '3rem', width: '55%', borderWidth: '1px' }}
            >
              Warianty
            </Components.Button>

            <Components.TextField
              label="Punkty"
              value={product?.points}
              type="number"
              slotProps={{ input: { endAdornment: 'pkt' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, points: Number(event.target.value) } as ProductType
                })
              }
            />

            <Components.TextField
              label="Cena"
              value={product?.price}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, price: Number(event.target.value) } as ProductType
                })
              }
            />

            <Components.TextField
              label="Cena promocyjna"
              value={product?.promoPrice}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, promoPrice: Number(event.target.value) } as ProductType
                })
              }
            />

            <Components.TextField
              label="Cena mieszana"
              value={product?.mixedPrice}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) =>
                setProduct((prev) => {
                  return { ...prev, mixedPrice: Number(event.target.value) } as ProductType
                })
              }
            />

            <Components.Checkbox
              label="Kupon"
              checked={!!product?.coupon}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProduct((prev) => {
                  return { ...prev, coupon: event.target.checked } as ProductType
                })
              }}
            />

            <Components.Checkbox
              label="Gazetka"
              checked={!!product?.newspaper}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setProduct((prev) => {
                  return { ...prev, newspaper: event.target.checked } as ProductType
                })
              }}
            />

            <div className={classes['buttons']}>
              <Components.Button onClick={save} colorVariant="primary" styles={{ height: '2.5rem' }}>
                {isButtonLoading ? <Components.PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Zapisz'}
              </Components.Button>

              {productId !== 'new' && (
                <Components.Button onClick={remove} colorVariant="error" styles={{ height: '2.5rem' }}>
                  {isButtonLoading ? <Components.PulseLoader size=".6rem" color="var(--primary-font-color)" /> : 'Usuń'}
                </Components.Button>
              )}
            </div>
          </>
        )}
      </div>
    </Components.AnimatedPage>
  )
}

export default ManageProduct

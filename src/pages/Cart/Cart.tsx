import { useState } from 'react'
import { toast } from 'react-toastify'
import classes from './Cart.module.css'
import useCart from '../../hooks/useCart'
import 'react-toastify/dist/ReactToastify.css'
import { AnimatePresence } from 'framer-motion'
import { getCartQR } from '../../utils/qrUtils'
import { useUserContext } from '../../stores/UserContext'
import { Product as ProductType } from '../../types/Product'
import { sumPrice, sumPoints } from '../../utils/cartHelper'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { Button, Modal, ListProduct, AnimatedPage } from './cartComponents'

const Cart = () => {
  const { user } = useUserContext()
  const { cartProducts, removeProduct } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrData, setQrData] = useState<string>()

  const onFinalize = async () => {
    if (!!!user) throw new Error('Unauthorized user')

    if (user.points < sumPoints(cartProducts)) {
      toast.dismiss()
      toast.error('Masz za mało punktów')
      return
    }

    const qrData = await getCartQR(user, cartProducts)
    setQrData(qrData)
    setIsModalOpen(true)
  }

  if (cartProducts.length === 0)
    return (
      <AnimatedPage>
        <div className={classes.container}>
          <span className={classes['empty-cart']}>Koszyk jest pusty</span>
        </div>
      </AnimatedPage>
    )

  return (
    <AnimatedPage>
      <div className={classes.container}>
        <div className={classes['product-container']}>
          {cartProducts.map((cartProduct: ProductType, index: number) => (
            <ListProduct
              key={`product${index}`}
              product={cartProduct}
              removeHandler={removeProduct}
            />
          ))}
        </div>
      </div>
      <div className={classes.summary}>
        <span>Suma punktów: {sumPoints(cartProducts)} pkt</span>
        <span>Kwota: {sumPrice(cartProducts)} zł</span>
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
        onClick={onFinalize}
      >
        Przejdź do płatności{' '}
      </Button>

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <div className={classes['qr-container']}>
              <LazyImage url={qrData!} />
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </AnimatedPage>
  )
}

export default Cart

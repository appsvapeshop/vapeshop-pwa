import { useState } from 'react'
import { toast } from 'react-toastify'
import classes from './Cart.module.css'
import useCart from '../../hooks/useCart'
import 'react-toastify/dist/ReactToastify.css'
import { AnimatePresence } from 'framer-motion'
import { getCartQR } from '../../utils/qrUtils'
import { useUserContext } from '../../stores/UserContext'
import { sumPrice, sumPoints } from '../../utils/cartHelper'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { Button, Modal, ProductsList, AnimatedPage } from './cartComponents'

const Cart = () => {
  const { user } = useUserContext()
  const [qrData, setQrData] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { cartProducts, removeProduct, clearCart } = useCart()

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
          <ProductsList products={cartProducts} removeHandler={removeProduct} />
        </div>
      </div>
      <div className={classes.summary}>
        <span>Suma punktów: {sumPoints(cartProducts)} pkt</span>
        <span>Kwota: {sumPrice(cartProducts)} zł</span>
      </div>

      <div className={classes.buttons}>
        <Button onClick={onFinalize} colorVariant="primary" styles={{ height: '2.5rem' }}>
          Przejdź do płatności
        </Button>

        <Button onClick={() => clearCart()} colorVariant="error" styles={{ height: '2.5rem' }}>
          Wyczyść
        </Button>
      </div>

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

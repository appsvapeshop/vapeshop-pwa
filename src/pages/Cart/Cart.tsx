import { useState } from 'react'
import { toast } from 'react-toastify'
import classes from './Cart.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { generateCartQR } from '../../utils/QrUtils'
import { useUserContext } from '../../stores/UserContext'
import { useCartContext } from '../../stores/CartContext'
import { sumPrice, sumPoints } from '../../utils/ProductUtils'

import { AnimatePresence } from 'framer-motion'
import LazyImage from '../../components/ui/LazyImage/LazyImage'
import { Button, Modal, ProductsList, AnimatedPage } from './cartComponents'

import UnauthorizedUser from '../../exceptions/UnauthorizedUser'

/**
 * Display user Cart with all products.
 */
const Cart = () => {
  const { user } = useUserContext()
  const [qrData, setQrData] = useState<string>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { products, removeProduct, clearCart } = useCartContext()

  const onFinalize = async () => {
    if (!user) throw new UnauthorizedUser()

    if (user.points < sumPoints(products)) {
      toast.dismiss()
      toast.error('Masz za mało punktów')
      return
    }

    const qrData = await generateCartQR(user, products)
    setQrData(qrData)
    setIsModalOpen(true)
  }

  if (products.length === 0)
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
          <ProductsList products={products} removeHandler={removeProduct} />
        </div>
      </div>
      <div className={classes.summary}>
        <span>Suma punktów: {sumPoints(products)} pkt</span>
        <span>Kwota: {sumPrice(products)} zł</span>
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

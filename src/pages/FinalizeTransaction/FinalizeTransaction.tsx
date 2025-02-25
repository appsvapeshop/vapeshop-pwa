import * as Types from './types'
import { toast } from 'react-toastify'
import * as Components from './components'
import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { AnimatePresence } from 'framer-motion'
import { getUserById } from '../../utils/userUtils'
import classes from './FinalizeTransaction.module.css'
import { useUserContext } from '../../stores/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { sumPoints, sumPrice } from '../../utils/cartHelper'
import { getProductsWithVariants } from '../../utils/productsHelper'
import { TransactionMode } from '../../enums/TransactionMode'
import * as transactionUtils from '../../utils/transactionUtils'
import { getDatabaseProducts } from '../../utils/transactionUtils'

const FinalizeTransaction = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addTransaction } = useUserContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [qrData] = useState<Types.QrData>(location.state)
  const [databaseProducts, setDatabaseProducts] = useState<Types.Product[]>([])

  useEffect(() => {
    const prepareTransaction = async () => {
      try {
        transactionUtils.validateQr(qrData)
      } catch (error) {
        toast.error((error as Error).message)
      }

      const retrievedProducts = await getProductsWithVariants(Object.keys(qrData.productsSummary!))
      setDatabaseProducts(getDatabaseProducts(retrievedProducts, qrData));

      try {
        transactionUtils.validateProductsWithDatabase(qrData, retrievedProducts)
      } catch (error) {
        toast.error((error as Error).message)
      }

      setIsLoading(false)
    }

    prepareTransaction()
  }, [qrData])

  const onFinalize = async () => {
    try {
      const retrievedCustomer = await getUserById(qrData.userId!)
      const totalPoints = sumPoints(databaseProducts)
      const totalAmount = sumPrice(databaseProducts)

      if (totalPoints > retrievedCustomer.points) {
        toast.error('Klient nie ma wystarczająco punktów')
        return
      }

      const transaction: Types.Transaction = {
        transactionMode: TransactionMode.Exchange,
        customerId: qrData.userId!,
        transactionDate: Timestamp.now(),
        points: totalPoints,
        price: totalAmount,
        products: databaseProducts
      }

      await addTransaction(transaction)
      toast.success('Transakcja przebiegła pomyślnie')
      navigate('/')
    } catch (error) {
      toast.error('Coś poszło nie tak')
    }
  }

  return (
    <Components.AnimatedPage>
      <div className={classes.container}>
        {isLoading &&
          [...Array(3)].map((element, index) => (
            <Components.ListProductSkeleton key={index} {...element} />
          ))}

        {!isLoading && databaseProducts && (
          <>
            <div className={classes['product-container']}>
              <Components.ProductsList products={databaseProducts} readOnly={true} />
            </div>

            <div className={classes['summary-container']}>
              <div className={classes.summary}>
                <span>Baza danych</span>
                <span>punkty: {sumPoints(databaseProducts)} pkt</span>
                <span>Kwota: {sumPrice(databaseProducts)} zł</span>
              </div>
              <div className={classes.summary}>
                <span>Koszyk klienta</span>
                <span>punkty: {qrData.pointAmount} pkt</span>
                <span>Kwota: {qrData.cartAmount} zł</span>
              </div>
            </div>

            <Components.Button
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
              onClick={() => setIsModalOpen(true)}
            >
              Zakończ
            </Components.Button>
          </>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isModalOpen && (
          <Components.Modal onClose={() => setIsModalOpen(false)}>
            <Components.Confirmation
              warning={
                transactionUtils.isAmountsValid(databaseProducts, qrData) ? '' : 'Kwoty są różne'
              }
              onConfirmation={onFinalize}
              onCancel={async () => setIsModalOpen(false)}
            />
          </Components.Modal>
        )}
      </AnimatePresence>
    </Components.AnimatedPage>
  )
}

export default FinalizeTransaction

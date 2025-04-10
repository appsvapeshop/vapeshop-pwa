import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { AnimatePresence } from 'framer-motion'
import classes from './FinalizeTransaction.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import { sumPoints, sumPrice } from '../../utils/ProductUtils'
import { getProductsWithVariants } from '../../services/ProductService'
import { getUserById, addTransaction } from '../../services/UserService'
import {
  validateQr,
  validateProductsWithDatabase,
  isAmountsValid,
  getProductListFromQr
} from '../../utils/TransactionUtils'

import { TransactionMode } from '../../enums/TransactionMode'

import * as Types from './types'
import * as Components from './components'
import ErrorOccurred from '../../exceptions/ErrorOccurred'

/**
 * Page where transaction is finalized by admin. All required data should be scanned from QR.
 */
const FinalizeTransaction = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customer, setCustomer] = useState<Types.User>()
  const [qrData] = useState<Types.QrData>(location.state)
  const [databaseProducts, setDatabaseProducts] = useState<Types.Product[]>([])

  /**
   * <ul>
   *     <li>Validate QR data.</li>
   *     <li>If valid, query all related products with variants.</li>
   *     <li>Validate if queried products are valid with QR data (products)</li>
   * </ul>
   */
  useEffect(() => {
    const prepareTransaction = async () => {
      try {
        validateQr(qrData)
      } catch (error) {
        toast.error((error as Error).message)
      }

      const retrievedProducts = await getProductsWithVariants(Object.keys(qrData.productsSummary!))
      setDatabaseProducts(getProductListFromQr(retrievedProducts, qrData))

      try {
        setCustomer(await getUserById(qrData.userId!))
        validateProductsWithDatabase(qrData, retrievedProducts)
      } catch (error) {
        toast.error((error as Error).message)
      }
    }

    prepareTransaction()
      .catch(() => {
        throw new ErrorOccurred()
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [qrData])

  /**
   * Check if user have enough points and if yes, save transaction.
   */
  const onFinalize = async () => {
    if (!customer) {
      toast.error('Użytkownik nie znaleziony')
      return;
    }

    try {
      const totalPoints = sumPoints(databaseProducts)
      const totalAmount = sumPrice(databaseProducts)

      if (totalPoints > customer.points) {
        toast.error('Klient nie ma wystarczająco punktów')
        return
      }

      const transaction: Types.Transaction = {
        mode: TransactionMode.Exchange,
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
          [...Array(3)].map((element, index) => <Components.ListProductSkeleton key={index} {...element} />)}

        {!isLoading && databaseProducts && (
          <>
            <div className={classes['product-container']}>
              <Components.ProductsList products={databaseProducts} readOnly={true} />
            </div>

            <div className={classes.user}>
              <span>{customer?.email}</span>
              <b>Użytkownik</b>
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

      {/*@ts-ignore*/}
      <AnimatePresence mode="wait">
        {isModalOpen && (
          <Components.Modal onClose={() => setIsModalOpen(false)}>
            <Components.Confirmation
              message={isAmountsValid(databaseProducts, qrData) ? '' : 'Kwoty są różne'}
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

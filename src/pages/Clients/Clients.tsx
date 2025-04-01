import { toast } from 'react-toastify'
import classes from './Clients.module.css'
import { Timestamp } from 'firebase/firestore'
import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSettingsContext } from '../../stores/SettingsContext'
import { getUserById, addTransaction } from '../../services/UserService'

import TextField from '@mui/material/TextField'
import PulseLoader from 'react-spinners/PulseLoader'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import UserSearchInput from '../../components/ui/UserSearchInput/UserSearchInput'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'

import { User } from '../../types/User'
import { QrData } from '../../types/QrData'
import { Transaction } from '../../types/Transaction'
import ErrorOccurred from '../../exceptions/ErrorOccurred'
import { TransactionMode } from '../../enums/TransactionMode'

/**
 * Display admin panel for managing user (clients) where you add transactions or check their history.
 * This component is fired in two modes:
 *
 * <ul>
 *     <li>By manually entering the administration panel.</li>
 *     <li>Or by scanning the QR code from Cart.</li>
 * </ul>
 *
 */
const Clients = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [amount, setAmount] = useState<number>(0)
  const amountRef = useRef<HTMLInputElement>(null)
  const [qrData] = useState<QrData>(location.state)
  const { settings } = useSettingsContext()
  const [isLoading, setIsLoading] = useState(false)
  const [customer, setCustomer] = useState<User | null>()
  const [transactionSending, setTransactionSending] = useState(false)

  /**
   * If QR code scanned data are not null then query user from database.
   */
  useEffect(() => {
    const prepareClient = async () => {
      const retrievedCustomer = await getUserById(qrData.userId!)
      setCustomer(retrievedCustomer)
    }

    if (qrData) {
      setIsLoading(true)

      prepareClient()
        .catch(() => {
          throw new ErrorOccurred()
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [qrData])

  /**
   * Validate data and if valid, add points to user account ( create new transaction ).
   */
  const onAddPoints = async () => {
    if (!customer || !customer.id) {
      toast.dismiss()
      toast.error('Klient nie został wybrany')
      return
    }

    if (!amount) {
      toast.dismiss()
      toast.error('Kwota nie została wprowadzona')
      return
    }

    if (!settings.amountForOnePoint) {
      toast.dismiss()
      toast.error('Stawka za 1 punkt nie może być 0 zł')
      return
    }

    setTransactionSending(true)

    const transaction: Transaction = {
      transactionMode: TransactionMode.Sell,
      customerId: customer.id,
      transactionDate: Timestamp.now(),
      points: Math.trunc(amount / settings.amountForOnePoint),
      price: amount
    }

    try {
      await addTransaction(transaction)
      toast.success('Transakcja została dodana')
      setCustomer((prevState) => ({
        ...(prevState as User),
        points: prevState!.points + transaction.points
      }))
      clearFields()
    } catch (_error) {
      toast.error('Coś poszło nie tak')
    }
    setTransactionSending(false)
  }

  /**
   * Clear all fields.
   */
  const clearFields = () => {
    setAmount(0)
    amountRef.current!.querySelector('input')!.value = ''
  }

  /**
   * When button "Show history" is clicked, redirect to history page.
   */
  const onShowHistory = () => {
    if (!customer?.id) {
      toast.error('Wybierz klienta')
      return
    }

    navigate(`/admin/panel/clients/history/${customer?.id}`)
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <div className={classes.skeletons}>
            {[...Array(3)].map((element, index) => (
              <InputSkeleton key={index} {...element} />
            ))}
          </div>
        )}

        {!isLoading && (
          <>
            <UserSearchInput onUserSelect={(user) => setCustomer(user)} />
            <TextField
              label="Punkty"
              value={customer?.points || ''}
              variant="standard"
              disabled
              slotProps={{ input: { endAdornment: 'pkt' } }}
            />
            <TextField
              ref={amountRef}
              className={classes.input}
              label="Kwota zakupu"
              variant="outlined"
              color="secondary"
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
            <TextField
              label="+ punkty"
              variant="standard"
              value={!amount ? '' : Math.trunc(amount / (settings.amountForOnePoint || 0))}
              disabled
              slotProps={{ input: { endAdornment: 'pkt' } }}
            />
            <div className={classes.buttons}>
              <Button styles={{ height: 39 }} onClick={onAddPoints}>
                {transactionSending ? (
                  <>
                    <PulseLoader size=".6rem" color="var(--primary-font-color)" />
                  </>
                ) : (
                  'Dodaj punkty'
                )}
              </Button>
              <Button styles={{ height: 39 }} onClick={onShowHistory}>
                Zobacz historię
              </Button>
            </div>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default Clients

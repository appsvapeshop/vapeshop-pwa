import { toast } from 'react-toastify'
import { User } from '../../types/User'
import classes from './Clients.module.css'
import { Timestamp } from 'firebase/firestore'
import TextField from '@mui/material/TextField'
import { useState, useRef, useEffect } from 'react'
import { getUserById } from '../../utils/userUtils'
import { searchUsers } from '../../utils/userUtils'
import PulseLoader from 'react-spinners/PulseLoader'
import { Transaction } from '../../types/Transaction'
import Autocomplete from '@mui/material/Autocomplete'
import { AnimatedPage } from '../Cart/cartComponents'
import { QrData } from '../FinalizeTransaction/types'
import Button from '../../components/ui/Button/Button'
import { useUserContext } from '../../stores/UserContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { TransactionMode } from '../../enums/TransactionMode'
import { useSettingsContext } from '../../stores/SettingsContext'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'

const Clients = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { addTransaction } = useUserContext()
  const [amount, setAmount] = useState<number>(0)
  const amountRef = useRef<HTMLInputElement>(null)
  const [qrData] = useState<QrData>(location.state)
  const { conversionFactor } = useSettingsContext()
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<User[]>([])
  const [customer, setCustomer] = useState<User | null>()
  const [transactionSending, setTransactionSending] = useState(false)
  const [noOptionText, setNoOptionText] = useState<string>('Wprowadź min 3 znaki')

  useEffect(() => {
    const prepareClient = async () => {
      setIsLoading(true)
      const retrievedCustomer = await getUserById(qrData.userId!)
      setCustomer(retrievedCustomer)
      setIsLoading(false)
    }

    if (qrData !== null) {
      prepareClient()
    }
  }, [qrData])

  const onSearch = async (event: React.KeyboardEvent) => {
    if ((event.target as HTMLInputElement).value.length < 3) {
      setNoOptionText('Wprowadź 5 pierwszych znaków')
      return
    }

    const users = await searchUsers((event.target as HTMLInputElement).value)
    if (users.length === 0) {
      setNoOptionText('Nie znaleziono')
      return
    }

    setCustomers(users)
  }

  const onAddPoints = async () => {
    if (!!!customer || !!!customer.id) {
      toast.dismiss()
      toast.error('Klient nie został wybrany')
      return
    }

    if (!!!amount) {
      toast.dismiss()
      toast.error('Kwota nie została wprowadzona')
      return
    }

    setTransactionSending(true)

    const transaction: Transaction = {
      mode: TransactionMode.Sell,
      userId: customer.id,
      timestamp: Timestamp.now(),
      points: amount * (conversionFactor || 0),
      price: amount
    }

    try {
      await addTransaction(transaction)
      toast.success('Transakcja została dodana')
      setCustomer((prevState) => ({
        ...(prevState as User),
        points: prevState!.points + transaction.points
      }))
      clearAfterCommit()
    } catch (_error) {
      toast.error('Coś poszło nie tak')
    }
    setTransactionSending(false)
  }

  const clearAfterCommit = () => {
    setAmount(0)
    amountRef.current!.querySelector('input')!.value = ''
    setCustomers([])
  }

  const onShowHistory = () => {
    if (!!!customer?.id) {
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
            <Autocomplete
              autoHighlight
              clearOnBlur
              className={classes['autocomplete']}
              disablePortal
              onChange={(_event, option) => {
                setCustomer(option?.value)
              }}
              noOptionsText={noOptionText}
              options={customers.map((customer) => {
                return { label: customer.email, value: customer }
              })}
              renderInput={(params) => (
                <TextField
                  className={classes.search}
                  color="secondary"
                  label="Klient"
                  {...params}
                />
              )}
              onKeyUp={onSearch}
            />

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
              value={!!!amount ? '' : amount * (conversionFactor || 0)}
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

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import classes from './ClientHistory.module.css'
import { getUserTransactions } from '../../services/TransactionService'

import * as Material from '@mui/material'
import { AnimatedPage } from '../Cart/cartComponents'
import TableSkeleton from '../../components/skeletons/TableSkeleton/TableSkeleton'
import TransactionHistory from '../../components/ui/TransactionHistory/TransactionHistory'

import { Transaction } from '../../types/Transaction'
import ErrorOccurred from '../../exceptions/ErrorOccurred'

/**
 * Display all transaction in table related to given user.
 */
const ClientHistory = () => {
  const { userId } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  /**
   * Fetch all transaction for given User ID.
   */
  useEffect(() => {
    const getTransactions = async () => {
      const transactions = await getUserTransactions(userId!)
      setTransactions(transactions)
      setIsLoading(false)
    }

    if (userId) {
      getTransactions().catch(() => {
        throw new ErrorOccurred()
      })
    }
  }, [userId])

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && <TableSkeleton columns={4} rows={5} />}

        {!isLoading && (
          <>
            <h2>Historia zakupów</h2>
            <Material.TableContainer>
              <Material.Table>
                <Material.TableHead>
                  <Material.TableRow>
                    <Material.TableCell>Tryb</Material.TableCell>
                    <Material.TableCell>Data</Material.TableCell>
                    <Material.TableCell>Punkty</Material.TableCell>
                    <Material.TableCell>Kwota</Material.TableCell>
                  </Material.TableRow>
                </Material.TableHead>
                <Material.TableBody>
                  {transactions.map((transaction, index) => (
                    <TransactionHistory transaction={transaction} key={index} />
                  ))}
                </Material.TableBody>
              </Material.Table>
            </Material.TableContainer>
          </>
        )}
      </div>
    </AnimatedPage>
  )
}

export default ClientHistory

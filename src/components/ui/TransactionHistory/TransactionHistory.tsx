import { useState } from 'react'
import * as Material from '@mui/material'
import Collapse from '@mui/material/Collapse'
import classes from './TransactionHistory.module.css'
import { Transaction } from '../../../types/Transaction'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'
import { TransactionMode } from '../../../enums/TransactionMode'
import TappedComponent from '../../animations/TappedComponent/TappedComponent'

/**
 * Component display transaction history for given transaction record.
 *
 * @param transaction record. Must not be null.
 */
const TransactionHistory = ({ transaction }: { transaction: Transaction }) => {
  const [isRowExpanded, setIsRowExpanded] = useState(false)

  return (
    <>
      <Material.TableRow>
        <Material.TableCell>
          <TappedComponent onClick={() => setIsRowExpanded((prev) => !prev)}>
            {transaction.mode === TransactionMode.Sell ? 'Sprzedaż' : 'Wymiana'}
            {transaction.mode === TransactionMode.Exchange && (
              <>{isRowExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}</>
            )}
          </TappedComponent>
        </Material.TableCell>
        <Material.TableCell>
          <TappedComponent>
            {new Date(transaction.transactionDate.seconds * 1000).toLocaleTimeString()}
            <br />
            {new Date(transaction.transactionDate.seconds * 1000).toLocaleDateString()}
          </TappedComponent>
        </Material.TableCell>
        <Material.TableCell>
          <TappedComponent>{transaction.points} pkt</TappedComponent>
        </Material.TableCell>
        <Material.TableCell>
          <TappedComponent>{transaction.price} zł</TappedComponent>
        </Material.TableCell>
      </Material.TableRow>

      {transaction.mode === TransactionMode.Exchange && (
        <Material.TableRow>
          <Material.TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isRowExpanded} timeout="auto" unmountOnExit>
              <Material.Table>
                <Material.TableHead>
                  <Material.TableRow>
                    <Material.TableCell>Nazwa</Material.TableCell>
                    <Material.TableCell>Data</Material.TableCell>
                    <Material.TableCell>Punkty</Material.TableCell>
                    <Material.TableCell>Kwota</Material.TableCell>
                  </Material.TableRow>
                </Material.TableHead>
                <Material.TableBody>
                  {transaction.products?.map((product, index) => (
                    <Material.TableRow key={index}>
                      <Material.TableCell>
                        <>
                          <span className={classes.brand}>{product.brand}</span>
                          <span className={classes.name}>{product.name}</span>
                        </>
                      </Material.TableCell>
                      <Material.TableCell>
                        <>
                          {new Date(transaction.transactionDate.seconds * 1000).toLocaleTimeString()}
                          <br />
                          {new Date(transaction.transactionDate.seconds * 1000).toLocaleDateString()}
                        </>
                      </Material.TableCell>
                      <Material.TableCell>{product.points} pkt</Material.TableCell>
                      <Material.TableCell>
                        {!!product.mixedPrice ? product.price : product.mixedPrice} zł
                      </Material.TableCell>
                    </Material.TableRow>
                  ))}
                </Material.TableBody>
              </Material.Table>
            </Collapse>
          </Material.TableCell>
        </Material.TableRow>
      )}
    </>
  )
}

export default TransactionHistory

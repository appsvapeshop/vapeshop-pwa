import { Skeleton } from '@mui/material'
import classes from './CartSummary.module.css'

/**
 * Skeleton component for CartSummary component.
 */
const CartSummary = () => {
  return (
    <div className={classes.container}>
      <Skeleton className={classes.image} variant="rounded" />
      <div className={classes.description}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}

export default CartSummary

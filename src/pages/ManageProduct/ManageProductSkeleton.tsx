import { Skeleton } from '@mui/material'
import classes from './ManageProduct.module.css'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'

/**
 * Skeleton component for Manage Products page.
 * TODO should be moved to components/skeletons or to parent component.
 */
const ManageProductSkeleton = () => {
  return (
    <div className={classes.skeletons}>
      <Skeleton variant="rounded" height={160} />
      {[...Array(3)].map((_element, index) => (
        <InputSkeleton key={index} />
      ))}
    </div>
  )
}

export default ManageProductSkeleton

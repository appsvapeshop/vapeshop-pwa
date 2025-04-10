import { Skeleton } from '@mui/material'
import classes from './ManageProduct.module.css'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'


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

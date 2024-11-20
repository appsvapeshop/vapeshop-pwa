import { Skeleton } from '@mui/material'
import classes from './ListProductSkeleton.module.css'

const ListProductSkeleton = () => {
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

export default ListProductSkeleton

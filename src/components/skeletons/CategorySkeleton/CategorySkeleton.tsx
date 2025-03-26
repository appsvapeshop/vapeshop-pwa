import { Skeleton } from '@mui/material'
import classes from './CategorySkeleton.module.css'

const CategorySkeleton = () => {
  return (
    <div className={classes.container}>
      <Skeleton className={classes.category} variant="rounded" />
    </div>
  )
}

export default CategorySkeleton

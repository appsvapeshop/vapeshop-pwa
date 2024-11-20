import { Skeleton } from '@mui/material'
import classes from './InputSkeleton.module.css'

const InputSkeleton = () => {
  return (
    <div className={classes.container}>
      <Skeleton className={classes.label} />
      <Skeleton className={classes.input} variant="rounded" />
    </div>
  )
}

export default InputSkeleton

import React, { FC } from 'react'
import { Skeleton } from '@mui/material'
import classes from './CardSkeleton.module.css'

type Props = {
  containerClass?: string
  containerStyles?: React.CSSProperties
}

/**
 * Skeleton component for cards.
 *
 * @param containerClass CSS class name. May be null.
 * @param containerStyles CSS styles. May be null.
 */
const CardSkeleton: FC<Props> = ({ containerClass, containerStyles }) => {
  return (
    <div className={`${classes.container} ${containerClass}`} style={containerStyles}>
      <Skeleton className={classes.card} variant="rounded" />
    </div>
  )
}

export default CardSkeleton

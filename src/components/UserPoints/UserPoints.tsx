import { useState } from 'react'
import classes from './UserPoints.module.css'
import PuffLoader from 'react-spinners/PuffLoader'
import { useUserContext } from '../../stores/UserContext'
import TappedComponent from '../animations/TappedComponent/TappedComponent'
import { toast } from 'react-toastify'

const UserPoints = () => {
  const { user, refreshUser } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)

  const onRefresh = async () => {
    setIsLoading(true)
    await refreshUser()
    setIsLoading(false)

    toast.dismiss()
    toast.success('Punkty zaktualizowane')
  }

  return (
    <TappedComponent className={classes.container} onClick={onRefresh}>
      {isLoading && (
        <PuffLoader className={classes.loader} size="5rem" color="var(--second-font-color)" />
      )}
      {!isLoading && (
        <>
          <span className={classes.greetings}>Cześć {user?.email.split('@')[0]},</span>
          <span className={classes.points}>{user?.points}</span>
          <span className={classes['your-points']}>twoje punkty</span>
        </>
      )}
    </TappedComponent>
  )
}

export default UserPoints

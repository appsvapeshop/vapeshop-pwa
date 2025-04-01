import { useState } from 'react'
import { toast } from 'react-toastify'
import classes from './UserPoints.module.css'
import PuffLoader from 'react-spinners/PuffLoader'
import { useUserContext } from '../../stores/UserContext'
import TappedComponent from '../animations/TappedComponent/TappedComponent'

/**
 * The component that displays user point on Home page.
 */
const UserPoints = () => {
  const { user, refreshUser } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Refresh user point onClick.
   */
  const onRefresh = async () => {
    setIsLoading(true)
    await refreshUser()
    setIsLoading(false)

    toast.dismiss()
    toast.success('Punkty zaktualizowane')
  }

  return (
    <TappedComponent className={classes.container} onClick={onRefresh}>
      {isLoading && <PuffLoader className={classes.loader} size="5rem" color="var(--second-font-color)" />}
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

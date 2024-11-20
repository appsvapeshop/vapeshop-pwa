import { useState, useEffect } from 'react'
import classes from './UserCard.module.css'
import { getUserQR } from '../../utils/qrUtils'
import LazyImage from '../ui/LazyImage/LazyImage'
import { useUserContext } from '../../stores/UserContext'

const UserCard = () => {
  const { user } = useUserContext()
  const [qrData, setQrData] = useState<string>()

  useEffect(() => {
    const getUserCode = async () => {
      setQrData(await getUserQR(user!))
    }

    getUserCode()
  }, [user])

  if (qrData === undefined) return

  return (
    <div className={classes.container}>
      <LazyImage url={qrData} />
    </div>
  )
}

export default UserCard

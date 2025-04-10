import { useState, useEffect } from 'react'
import classes from './UserCard.module.css'
import LazyImage from '../ui/LazyImage/LazyImage'
import { generateUserQR } from '../../utils/QrUtils'
import { useUserContext } from '../../stores/UserContext'
import ErrorOccurred from '../../exceptions/ErrorOccurred'

/**
 * The component that displays user QR Card.
 */
const UserCard = () => {
  const { user } = useUserContext()
  const [qrData, setQrData] = useState<string>()

  useEffect(() => {
    const getUserCode = async () => {
      setQrData(await generateUserQR(user!))
    }

    getUserCode().catch(() => {
      throw new ErrorOccurred()
    })
  }, [user])

  return (
    <div className={classes.container}>
      <LazyImage url={qrData!} />
    </div>
  )
}

export default UserCard

import { useState, useEffect } from 'react'
import classes from './UserCard.module.css'
import { generateUserQR } from '../../utils/QrUtils'
import LazyImage from '../ui/LazyImage/LazyImage'
import { useUserContext } from '../../stores/UserContext'

const UserCard = () => {
  const { user } = useUserContext()
  const [qrData, setQrData] = useState<string>()

  useEffect(() => {
    const getUserCode = async () => {
      setQrData(await generateUserQR(user!))
    }

    getUserCode()
  }, [user])
  
  return (
    <div className={classes.container}>
      <LazyImage url={qrData!} />
    </div>
  )
}

export default UserCard

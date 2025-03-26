import { Result } from '@zxing/library'
import { QrReader } from 'react-qr-reader'
import { QrData } from '../../types/QrData'
import classes from './QrScanner.module.css'
import { useNavigate } from 'react-router-dom'
import { QrContext } from '../../enums/QrContext'

/**
 * Component which allow user to scan QR code.
 *
 * @param onClose event. Must not be null.
 */
const QrScanner = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate()

  const onScanned = (result: Result | null | undefined) => {
    if (!!result) {
      const scannedData = JSON.parse(result.getText()) as QrData
      if (scannedData.qrContext === QrContext.UserCard) {
        navigate('/admin/panel/clients', { state: { ...scannedData } })
        onClose()
      } else if (scannedData.qrContext === QrContext.FinalizeCart) {
        navigate('/admin/finalizeTransaction', { state: { ...scannedData } })
        onClose()
      }
    }
  }

  return (
    <div className={classes.container}>
      <QrReader
        constraints={{ facingMode: { ideal: 'environment' } }}
        videoStyle={{ position: 'relative', borderRadius: 20 }}
        videoContainerStyle={{
          padding: 10
        }}
        onResult={onScanned}
      />
    </div>
  )
}

export default QrScanner

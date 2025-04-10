import { LegacyRef } from 'react'
import { QrData } from '../../types/QrData'
import classes from './QrScanner.module.css'
import { useNavigate } from 'react-router-dom'
import { useZxing, Result } from 'react-zxing'
import { QrContext } from '../../enums/QrContext'

/**
 * Component which allow user to scan QR code.
 *
 * @param onClose event. Must not be null.
 */
const QrScanner = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate()
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScanned(result)
    }
  })

  /**
   * Decode scanned data and take action.
   *
   * @param result from camera. Must not be null.
   */
  const onScanned = (result: Result) => {
    if (!result) return
    const scannedData = JSON.parse(result.getText()) as QrData

    if (scannedData.qrContext === QrContext.UserCard) {
      navigate('/admin/panel/clients', { state: { ...scannedData } })
      onClose()
    } else if (scannedData.qrContext === QrContext.FinalizeCart) {
      navigate('/admin/finalizeTransaction', { state: { ...scannedData } })
      onClose()
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes['video-container']}>
        <video className={classes.video} ref={ref as LegacyRef<HTMLVideoElement>} />
      </div>
    </div>
  )
}

export default QrScanner

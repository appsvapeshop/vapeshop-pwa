import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import classes from './ShopSettings.module.css'
import Input from '../../components/ui/Input/Input'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import { Checkbox, FormControlLabel } from '@mui/material'
import { SettingStatus } from '../../types/SettingsContext'
import { SettingsContext } from '../../types/SettingsContext'
import { useSettingsContext } from '../../stores/SettingsContext'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'

const ShopSettings = () => {
  const settings = useSettingsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [temporarySettings, setTemporarySettings] = useState<SettingsContext>({ ...settings })

  useEffect(() => {
    setIsLoading(!(settings.settingsStatus === SettingStatus.Completed))
  }, [settings.settingsStatus])

  const onSave = async () => {
    if (!!!temporarySettings?.conversionFactor) {
      toast.dismiss()
      toast.error('Ilość punktów za 1zł nie może być 0')
      return
    }

    try {
      await settings.updateSettings(temporarySettings)
      toast.success('Ustawienia zapisane')
    } catch (error) {
      toast.dismiss()
      toast.error('Coś poszło nie tak')
    }
  }

  return (
    <AnimatedPage>
      <div className={classes.container}>
        {isLoading && (
          <div className={classes.skeletons}>
            {[...Array(3)].map((element, index) => (
              <InputSkeleton key={index} {...element} />
            ))}
          </div>
        )}

        {!isLoading && (
          <>
            <Input
              variant="outlined"
              label="Ilość punktów za 1zł"
              type="number"
              colorVariant="secondary"
              value={temporarySettings?.conversionFactor}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value: number = Number(event.target.value)
                setTemporarySettings({ ...temporarySettings!, conversionFactor: value })
              }}
            />
            <FormControlLabel
              labelPlacement="top"
              label="Kategorie dla kuponów"
              control={
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  color="secondary"
                  checked={temporarySettings?.categoriesForCoupons}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTemporarySettings({
                      ...temporarySettings!,
                      categoriesForCoupons: event.target.checked
                    })
                  }}
                />
              }
            />
            <FormControlLabel
              labelPlacement="top"
              label="Kategorie dla gazety"
              control={
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  color="secondary"
                  checked={temporarySettings?.categoriesForNewspaper}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTemporarySettings({
                      ...temporarySettings!,
                      categoriesForNewspaper: event.target.checked
                    })
                  }}
                />
              }
            />
          </>
        )}
      </div>

      <Button
        containerStyle={{
          margin: '2rem 0',
          position: 'sticky',
          bottom: '6rem',
          display: 'flex',
          justifyContent: 'center'
        }}
        styles={{
          width: '80%',
          height: '2.5rem'
        }}
        onClick={onSave}
      >
        Zapisz
      </Button>
    </AnimatedPage>
  )
}

export default ShopSettings

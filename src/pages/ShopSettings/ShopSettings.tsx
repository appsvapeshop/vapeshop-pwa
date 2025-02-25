import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import classes from './ShopSettings.module.css'
import { AnimatedPage } from '../Cart/cartComponents'
import Button from '../../components/ui/Button/Button'
import { Checkbox, FormControlLabel } from '@mui/material'
import { FetchStatus } from '../../enums/FetchStatus'
import { ShopSettingsContext } from '../../types/ShopSettingsContext'
import TextField from '../../components/ui/TextField/TextField'
import { useSettingsContext } from '../../stores/SettingsContext'
import InputSkeleton from '../../components/skeletons/InputSkeleton/InputSkeleton'

const ShopSettings = () => {
  const settings = useSettingsContext()
  const [isLoading, setIsLoading] = useState(true)
  const [temporarySettings, setTemporarySettings] = useState<ShopSettingsContext>({ ...settings })

  useEffect(() => {
    setIsLoading(!(settings.fetchStatus === FetchStatus.Completed))
  }, [settings.fetchStatus])

  const onSave = async () => {
    if (!temporarySettings.settings.amountForOnePoint) {
      toast.dismiss()
      toast.error('Stawka za 1 punkt nie może być 0 zł')
      return
    }

    try {
      await settings.updateSettings(temporarySettings.settings)
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
            <TextField
              label="Stawka za 1 punkt"
              value={temporarySettings.settings.amountForOnePoint}
              type="number"
              slotProps={{ input: { endAdornment: 'zł' } }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value: number = Number(event.target.value)
                setTemporarySettings({...temporarySettings, settings: {...temporarySettings.settings, amountForOnePoint: value}});
              }}
            />

            <FormControlLabel
              labelPlacement="top"
              label="Kategorie dla kuponów"
              control={
                <Checkbox
                  style={{ transform: 'scale(1.2)' }}
                  color="secondary"
                  checked={temporarySettings?.settings.categoriesForCoupons}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTemporarySettings({...temporarySettings, settings: {...temporarySettings.settings, categoriesForCoupons: event.target.checked}});
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
                  checked={temporarySettings?.settings.categoriesForNewspaper}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setTemporarySettings({...temporarySettings, settings: {...temporarySettings.settings, categoriesForNewspaper: event.target.checked}});
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

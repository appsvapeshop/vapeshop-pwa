import logo from '../../assets/logo.png'
import 'react-toastify/dist/ReactToastify.css'
import classes from './ForgotPassword.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import { useUserContext } from '../../stores/UserContext'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('')
  const navigation = useNavigate()
  const { resetPassword } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)

  const onReset = async () => {
    setIsLoading(true)

    if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email)) {
      toast.error('Email ma niepoprawny format')
      setIsLoading(false)
      return
    }

    try {
      await resetPassword(email)
    } catch (error) {}

    toast.success('Sprawdź swój email')
    setIsLoading(false)
  }

  return (
    <AnimatedPage>
      <ToastContainer
        position="top-center"
        toastClassName="toastify"
        autoClose={3000}
        closeOnClick
        transition={Zoom}
      />

      <TappedComponent>
        <IoIosArrowBack
          className={classes['step-back-icon']}
          size={40}
          onClick={() => navigation(-1)}
        />
      </TappedComponent>

      <form className={classes.container}>
        <img src={logo} alt="logo" />
        <Input
          label="Email"
          type="email"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="email"
          onChange={(event) => setEmail((event.target as HTMLInputElement).value)}
        />
        <Button
          onClick={onReset}
          styles={{ height: '2.5rem', width: '70%' }}
          colorVariant="secondary"
        >
          {isLoading ? (
            <PropagateLoader
              size=".6rem"
              color="var(--second-font-color)"
              cssOverride={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            />
          ) : (
            'Zresetuj'
          )}
        </Button>
      </form>
    </AnimatedPage>
  )
}

export default ForgotPassword

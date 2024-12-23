import logo from '../../assets/logo.png'
import 'react-toastify/dist/ReactToastify.css'
import classes from './Registration.module.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import { useUserContext } from '../../stores/UserContext'
import PropagateLoader from 'react-spinners/PropagateLoader'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import { validateRegistration } from './validateRegistration'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import PasswordValidator from '../../components/PasswordValidator/PasswordValidator'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const Registration = () => {
  const navigation = useNavigate()
  const { createUser } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '', rePassword: '' })

  const onRegister = async () => {
    setIsLoading(true)
    toast.dismiss()

    try {
      validateRegistration(credentials.email, credentials.password, credentials.rePassword)
      await createUser(credentials.email, credentials.password)
      navigation('/')
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error((error as Error).message)
    }
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
          onChange={(event) =>
            setCredentials({ ...credentials, email: (event.target as HTMLInputElement).value })
          }
        />
        <Input
          label="Hasło"
          type="password"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="current-password"
          onChange={(event) =>
            setCredentials({ ...credentials, password: (event.target as HTMLInputElement).value })
          }
        />
        <PasswordValidator
          className={classes['password-validator']}
          password={credentials.password}
        />
        <Input
          label="Powtórz hasło"
          type="password"
          styles={{ width: '70%' }}
          variant="outlined"
          colorVariant="secondary"
          autoComplete="new-password"
          onChange={(event) =>
            setCredentials({ ...credentials, rePassword: (event.target as HTMLInputElement).value })
          }
        />{' '}
        <Button
          onClick={onRegister}
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
            'Zarejestruj'
          )}
        </Button>
      </form>
    </AnimatedPage>
  )
}

export default Registration

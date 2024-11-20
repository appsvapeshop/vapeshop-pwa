import classes from './Login.module.css'
import logo from '../../assets/logo.png'
import 'react-toastify/dist/ReactToastify.css'

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/ui/Input/Input'
import Button from '../../components/ui/Button/Button'
import { validateUser } from './userCredentialValidator'
import { useUserContext } from '../../stores/UserContext'
import { ToastContainer, Zoom, toast } from 'react-toastify'
import PropagateLoader from 'react-spinners/PropagateLoader'
import AnimatedPage from '../../components/animations/AnimatedPage/AnimatedPage'
import TappedComponent from '../../components/animations/TappedComponent/TappedComponent'

const Login = () => {
  const navigation = useNavigate()
  const { signIn } = useUserContext()
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const onLogin = async () => {
    setIsLoading(true)
    toast.dismiss()

    try {
      validateUser(credentials.email, credentials.password)
      await signIn(credentials.email, credentials.password)
      navigation('/')
    } catch (error) {
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

        <Button
          onClick={onLogin}
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
            'Zaloguj'
          )}
        </Button>

        <span>
          Nie masz konta ?
          <TappedComponent
            styles={{ display: 'inline-block', marginLeft: '5px' }}
            onClick={() => {
              navigation('/p/registration')
            }}
          >
            <b>Zarejestruj się</b>
          </TappedComponent>
        </span>

        <TappedComponent
          onClick={() => {
            navigation('/p/forgotPassword')
          }}
        >
          <b>
            <span className={classes['forgot-password']}>Zapomniałeś hasła ?</span>
          </b>
        </TappedComponent>
      </form>
    </AnimatedPage>
  )
}

export default Login

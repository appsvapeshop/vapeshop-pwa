export const validateUser = (username: string, password: string) => {
  if (username === '' || password === '') throw new Error('Email i hasło nie mogą być puste ')
}

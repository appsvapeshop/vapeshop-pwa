export const validateRegistration = (email: string, password: string, rePassword: string) => {
  if (email === '') throw new Error('Pole email nie może być puste')
  if (password === '') throw new Error('Pole hasło nie może być puste')
  if (rePassword === '') throw new Error('Pole powtórz hasło nie może być puste')
  if (!/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/.test(email)) throw new Error('Email ma niepoprawny format')
  if (password !== rePassword) throw new Error('Hasła nie są takie same')
}

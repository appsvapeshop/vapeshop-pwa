/**
 * Used when old password are invalid during password reset
 */
class InvalidOldPassword extends Error {
  constructor() {
    super('Stare hasło jest niepoprawne')
    this.stack = new Error().stack
  }
}

export default InvalidOldPassword

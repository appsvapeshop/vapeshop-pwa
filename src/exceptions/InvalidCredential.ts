/**
 * Used when credentials are invalid during authentication
 */
class InvalidCredential extends Error {
  constructor() {
    super('Email lub hasło jest niepoprawne')
    this.stack = new Error().stack
  }
}

export default InvalidCredential

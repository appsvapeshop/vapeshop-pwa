/**
 * Used when email are invalid during authentication
 */
class InvalidEmail extends Error {
  constructor() {
    super('Email niepoprawny')
    this.stack = new Error().stack
  }
}

export default InvalidEmail

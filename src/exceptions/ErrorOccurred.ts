/**
 * Generic exception thrown when the error is unknown
 */
class ErrorOccurred extends Error {
  constructor() {
    super('Wystąpił błąd')
    this.stack = new Error().stack
  }
}

export default ErrorOccurred

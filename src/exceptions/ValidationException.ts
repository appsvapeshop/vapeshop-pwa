/**
 * Generic validation exception
 */
class ValidationException extends Error {
  constructor(public message: string) {
    super(message)
    this.stack = new Error().stack
  }
}

export default ValidationException

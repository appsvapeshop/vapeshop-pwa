class InvalidOldPassword extends Error {
  constructor() {
    super('Stare hasło jest niepoprawne')
    this.stack = new Error().stack
  }
}

export default InvalidOldPassword
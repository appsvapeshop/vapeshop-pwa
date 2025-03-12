class WeakPassword extends Error {
  constructor() {
    super('Hasło jest za słabe')
    this.stack = new Error().stack
  }
}

export default WeakPassword
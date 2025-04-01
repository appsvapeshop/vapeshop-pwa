/**
 * Used during registration when the e-mail address is already used by another user
 */
class EmailInUse extends Error {
  constructor() {
    super('Email jest już w użyciu')
    this.stack = new Error().stack
  }
}

export default EmailInUse

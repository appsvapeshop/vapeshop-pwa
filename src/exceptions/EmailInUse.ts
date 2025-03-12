class EmailInUse extends Error {
  constructor() {
    super('Email jest już w użyciu')
    this.stack = new Error().stack
  }
}

export default EmailInUse
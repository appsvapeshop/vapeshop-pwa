class ValidationError extends Error {
  constructor(public message: string) {
    super(message)
    this.stack = (<any>new Error()).stack
  }
}

export default ValidationError

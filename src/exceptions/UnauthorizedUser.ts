/**
 * Used when given user is unauthorized.
 */
class UnauthorizedUser extends Error {
  constructor() {
    super('Użytkownik jest nieuprawniony')
    this.stack = new Error().stack
  }
}

export default UnauthorizedUser

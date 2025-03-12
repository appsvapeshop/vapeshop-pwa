/**
 * Used when queried user is not found
 */
class UserNotFound extends Error {
  constructor() {
    super('Nie znaleziono użytkownika')
    this.stack = new Error().stack
  }
}

export default UserNotFound

/**
 * Used when queried News not found
 */
class NewsNotFound extends Error {
  constructor() {
    super('News nie istnieje')
    this.stack = new Error().stack
  }
}

export default NewsNotFound

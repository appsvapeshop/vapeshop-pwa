/**
 * Used when queried Product not found
 */
class NewsNotFound extends Error {
  constructor() {
    super('Produkt nie istnieje')
    this.stack = new Error().stack
  }
}

export default NewsNotFound

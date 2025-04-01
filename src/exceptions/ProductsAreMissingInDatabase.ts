/**
 * Some products are missing from the database
 */
class ProductsAreMissingInDatabase extends Error {
  constructor() {
    super('Brak niektórych produktów w bazie')
    this.stack = new Error().stack
  }
}

export default ProductsAreMissingInDatabase

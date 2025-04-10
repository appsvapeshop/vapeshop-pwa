/**
 * Used when queried Category not found
 */
class CategoryNotFound extends Error {
  constructor() {
    super('Kategoria nie istnieje')
    this.stack = new Error().stack
  }
}

export default CategoryNotFound

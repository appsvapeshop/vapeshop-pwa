/**
 * Used when trying to delete category but it has products
 */
class CategoryHasProducts extends Error {
  constructor() {
    super('Kategoria ma przypisane produkty')
    this.stack = new Error().stack
  }
}

export default CategoryHasProducts

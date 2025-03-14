/**
 * Used when queried Variant not found
 */
class VariantNotFound extends Error {
  constructor() {
    super('Wariant nie istnieje')
    this.stack = new Error().stack
  }
}

export default VariantNotFound

/**
 * Used when Product Cart cannot be empty.
 */
class CartCannotBeEmpty extends Error {
  constructor() {
    super('Koszyk klienta nie może być pusty')
    this.stack = new Error().stack
  }
}

export default CartCannotBeEmpty

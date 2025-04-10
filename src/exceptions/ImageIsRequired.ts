/**
 * Used when image is required
 */
class ImageIsRequired extends Error {
  constructor() {
    super('Zdjęcie jest wymagane')
    this.stack = new Error().stack
  }
}

export default ImageIsRequired

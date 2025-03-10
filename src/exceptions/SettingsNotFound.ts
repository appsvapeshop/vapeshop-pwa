class SettingsNotFound extends Error {
  constructor() {
    super('Nie znaleziono ustawień sklepu')
    this.stack = new Error().stack
  }
}

export default SettingsNotFound

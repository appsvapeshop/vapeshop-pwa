class ErrorOccurred extends Error {
    constructor() {
        super('Wystąpił błąd')
        this.stack = new Error().stack
    }
}

export default ErrorOccurred

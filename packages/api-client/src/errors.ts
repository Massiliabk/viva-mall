// Erreur renvoyée par l'API (ou par le faux backend)
export class ApiRequestError extends Error {
  status: number
  code: string // ex. "NOT_FOUND", "OUT_OF_STOCK", "EMPTY_CART"

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.code = code
  }
}

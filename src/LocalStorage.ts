import type { ConsentCategories } from './types'
import { ValidateConsents } from './ValidateConsents'

export class LocalStorage {
  #validateConsents: ValidateConsents
  #localStorageName = 'consent-tracker'

  constructor() {
    this.#validateConsents = new ValidateConsents()
  }

  getConsents(): ConsentCategories {
    const storedConsents = this.#getStoredConsents()
    const parsedConsents = this.#parseConsents(storedConsents)
    this.#validateConsents.validateExpiredConsents(parsedConsents)

    return parsedConsents
  }

  #getStoredConsents(): string {
    const storedConsents = localStorage.getItem(this.#localStorageName)

    if (storedConsents) {
      return storedConsents
    } else {
      throw new Error('No stored consents')
    }
  }

  #parseConsents(storedConsents: string): ConsentCategories {
    try {
      const parsedConsents = JSON.parse(storedConsents)
      return parsedConsents
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      throw new Error(errorMessage)
    }
  }

  saveConsent(consent: ConsentCategories): void {
    localStorage.setItem(this.#localStorageName, JSON.stringify(consent))
  }

  clearConsent(): void {
    localStorage.removeItem(this.#localStorageName)
  }
}

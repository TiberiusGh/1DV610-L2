import type { ConsentCategories } from './types'
import { ConsentsValidator } from './ConsentsValidator'

export class LocalStorage {
  #consentsValidator = new ConsentsValidator()
  #localStorageName = 'consent-tracker'

  getConsents(): ConsentCategories {
    const storedConsents = this.#getStoredConsents()
    const parsedConsents = this.#parseConsents(storedConsents)
    const expiredConsents =
      this.#consentsValidator.validateExpiredConsents(parsedConsents)

    if (expiredConsents) {
      this.clearConsent()
      throw new Error('The consents are expired')
    }

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

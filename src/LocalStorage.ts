import type { ConsentCategories, ConsentsWithTimeStamp } from './types'
import { Validator } from './Validator'

export class LocalStorage {
  #validator = new Validator()
  #localStorageName = 'consent-tracker'

  getConsents(): ConsentsWithTimeStamp {
    const storedConsents = this.#getStoredConsents()
    const parsedConsents = this.#parseConsents(storedConsents)
    const expiredConsents = this.#validator.hasExpiredConsents(parsedConsents)

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

  #parseConsents(storedConsents: string): ConsentsWithTimeStamp {
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
    const ConsentsWithTimeStamp = this.#addCurrentTime(consent)

    localStorage.setItem(
      this.#localStorageName,
      JSON.stringify(ConsentsWithTimeStamp)
    )
  }

  #addCurrentTime(consents: ConsentCategories): ConsentsWithTimeStamp {
    const consentsWithTimeStamp: ConsentsWithTimeStamp = {
      ...consents,
      consentDate: new Date()
    }

    return consentsWithTimeStamp
  }

  clearConsent(): void {
    localStorage.removeItem(this.#localStorageName)
  }
}

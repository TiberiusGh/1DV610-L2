import { LocalStorage } from './LocalStorage'
import type { ConsentCategories } from './types'

export class ConsentsValidator {
  #localStorage = new LocalStorage()

  validateFalseContents(consents: ConsentCategories): boolean {
    return !(consents.analytics || consents.essential || consents.marketing)
  }

  #hasExpiredConsents(storedDate: Date): boolean {
    const currentDate = new Date()
    const expirationDate = new Date(storedDate)
    expirationDate.setMonth(expirationDate.getMonth() + 12)

    return currentDate > expirationDate // Returns true if expired
  }

  #clearExpiredConsents() {
    this.#localStorage.clearConsent()
    throw new Error('The consents are expired')
  }

  validateExpiredConsents(consents: ConsentCategories) {
    const expiredConsents = this.#hasExpiredConsents(consents.uppdateTime)

    if (expiredConsents) {
      this.#clearExpiredConsents()
    }
  }
}

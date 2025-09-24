import { LocalStorage } from './LocalStorage'
import type { ConsentCategories } from './types'

export class ConsentsValidator {
  validateFalseContents(consents: ConsentCategories): boolean {
    return !(consents.analytics || consents.essential || consents.marketing)
  }

  #hasExpiredConsents(storedDate: Date): boolean {
    const currentDate = new Date()
    const expirationDate = new Date(storedDate)
    expirationDate.setMonth(expirationDate.getMonth() + 12)

    return currentDate > expirationDate // Returns true if expired
  }

  validateExpiredConsents(consents: ConsentCategories): boolean {
    const expiredConsents = this.#hasExpiredConsents(consents.uppdateTime)

    return expiredConsents
  }
}

import type { ConsentCategories } from './types'

export class LocalStorage {
  #localStorageName = 'consent-tracker'
  getConsents(): ConsentCategories | null {
    const storedConsents = localStorage.getItem(this.#localStorageName)

    if (!storedConsents) {
      return null
    }
    try {
      const parsedConsents = JSON.parse(storedConsents)
      parsedConsents.uppdateTime = new Date(parsedConsents.uppdateTime)

      const isExpired = this.#validateDate(parsedConsents.uppdateTime)

      if (!isExpired) {
        return parsedConsents
      } else {
        this.clearConsent()
        return null
      }
    } catch (error) {
      return null
    }
  }
  saveConsent(consent: ConsentCategories): void {
    localStorage.setItem(this.#localStorageName, JSON.stringify(consent))
  }

  clearConsent(): void {
    localStorage.removeItem(this.#localStorageName)
  }

  validateFalseContents(consents: ConsentCategories): boolean {
    return !(consents.analytics || consents.essential || consents.marketing)
  }

  #validateDate(storedDate: Date): boolean {
    const currentDate = new Date()
    const expirationDate = new Date(storedDate)
    expirationDate.setMonth(storedDate.getMonth() + 12)

    return currentDate > expirationDate
  }
}

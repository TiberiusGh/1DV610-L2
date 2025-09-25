import type { ConsentCategories, ConsentsWithTimeStamp } from './types'
import { LocalStorage } from './LocalStorage'
import { Callback } from './Callback'
import { Validator } from './Validator'

export class ConsentTracker {
  #localStorage = new LocalStorage()
  #callback = new Callback()
  #validator = new Validator()

  // Wrapper function
  onConsentChange(callback: Function): ConsentTracker {
    this.#callback.onConsentChange(callback)
    return this
  }

  // Wrapper function
  getConsents(): ConsentsWithTimeStamp {
    return this.#localStorage.getConsents()
  }

  setConsents(consents: ConsentCategories): void {
    const falseConsents = this.#validator.validateFalseContents(consents)

    if (falseConsents) {
      this.#handleInvalidConsents()
    } else {
      this.#handleValidConsents(consents)
    }
  }

  uppdateConsent(category: string, value: boolean): void {
    const consents = this.#createConsentObject(category, value)
    const falseConsents = this.#validator.validateFalseContents(consents)

    if (falseConsents) {
      this.#handleInvalidConsents()
    } else {
      this.#handleValidConsents(consents)
    }
  }

  #createConsentObject(category: string, value: boolean): ConsentCategories {
    const consents = {
      essential: false,
      analytics: false,
      marketing: false
    }

    switch (category) {
      case 'essential':
        consents.essential = value
        break
      case 'analytics':
        consents.analytics = value
        break
      case 'marketing':
        consents.marketing = value
        break
    }
    return consents
  }

  acceptAll(): void {
    const consentedAll = {
      essential: true,
      analytics: true,
      marketing: true
    }
    this.#handleValidConsents(consentedAll)
  }

  declineAll(): void {
    this.#handleInvalidConsents()
  }

  #handleValidConsents(consents: ConsentCategories) {
    this.#localStorage.saveConsent(consents)
    this.#callback.runCallback(consents)
  }

  #handleInvalidConsents() {
    this.#localStorage.clearConsent()
    this.#callback.runCallback()
  }
}

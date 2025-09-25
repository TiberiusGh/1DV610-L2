import type { ConsentCategories, ConsentsWithTimeStamp } from './types'
import { LocalStorage } from './LocalStorage'
import { Callback } from './Callback'
import { Validator } from './Validator'
import { Webhook } from './Webhook'

export class ConsentTracker {
  #localStorage = new LocalStorage()
  #callback = new Callback()
  #validator = new Validator()
  #webhook: Webhook | null = null

  // Wrapper function
  onConsentChange(callback: Function): ConsentTracker {
    this.#callback.onConsentChange(callback)
    return this
  }

  // Wrapper function
  getConsents(): ConsentsWithTimeStamp {
    return this.#localStorage.getConsents()
  }

  setWebhook(endpoint: string): void {
    this.#webhook = new Webhook(endpoint)
  }

  setDeveloperMode() {
    this.#webhook?.setDevelopmentMode()
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

  #addCurrentTime(consents: ConsentCategories): ConsentsWithTimeStamp {
    const consentsWithTimeStamp: ConsentsWithTimeStamp = {
      ...consents,
      consentDate: new Date()
    }

    return consentsWithTimeStamp
  }

  #handleValidConsents(consents: ConsentCategories) {
    const consentsWithTimeStamp = this.#addCurrentTime(consents)

    this.#localStorage.saveConsent(consentsWithTimeStamp)
    this.#callback.runCallback(consentsWithTimeStamp)
    this.#webhook?.sendData(consentsWithTimeStamp)
  }

  #handleInvalidConsents() {
    this.#localStorage.clearConsent()
    this.#callback.runCallback()
  }
}

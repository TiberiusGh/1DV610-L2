import type { ConsentCategories } from './types'
import { LocalStorage } from './LocalStorage'
import { CallbackManager } from './CallbackManager'

export class ConsentTracker {
  #localStorage: LocalStorage
  #callbackManager: CallbackManager

  constructor() {
    this.#localStorage = new LocalStorage()
    this.#callbackManager = new CallbackManager()
  }

  onConsentChange(callback: Function): ConsentTracker {
    this.#callbackManager.onConsentChange(callback)
    return this
  }

  getConsents(): ConsentCategories | null {
    return this.#localStorage.getConsents()
  }

  setConsents(consents: ConsentCategories): void {
    const currentConsents = consents
    currentConsents.uppdateTime = new Date()

    const falseConsents =
      this.#localStorage.validateFalseContents(currentConsents)

    if (falseConsents) {
      this.#localStorage.clearConsent()
      this.#callbackManager.runCallback()
    } else {
      this.#localStorage.saveConsent(currentConsents)
      this.#callbackManager.runCallback(currentConsents)
    }
  }

  uppdateConsent(category: string, value: boolean): void {
    let storedConsent = this.#localStorage.getConsents()

    if (!storedConsent) {
      storedConsent = {
        essential: false,
        analytics: false,
        marketing: false,
        uppdateTime: new Date()
      }
    }

    switch (category) {
      case 'essential':
        storedConsent.essential = value
        break
      case 'analytics':
        storedConsent.analytics = value
        break
      case 'marketing':
        storedConsent.marketing = value
        break
    }

    storedConsent.uppdateTime = new Date()

    const falseConsents =
      this.#localStorage.validateFalseContents(storedConsent)

    if (falseConsents) {
      this.#localStorage.clearConsent()
      this.#callbackManager.runCallback()
    } else {
      this.#localStorage.saveConsent(storedConsent)
      this.#callbackManager.runCallback(storedConsent)
    }
  }

  acceptAll(): void {
    const consentedAll = {
      essential: true,
      analytics: true,
      marketing: true,
      uppdateTime: new Date()
    }

    this.#localStorage.saveConsent(consentedAll)
    this.#callbackManager.runCallback(consentedAll)
  }

  declineAll(): void {
    this.#localStorage.clearConsent()
    this.#callbackManager.runCallback()
  }
}

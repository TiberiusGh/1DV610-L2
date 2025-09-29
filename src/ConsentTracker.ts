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
  /**
   * Registers a callback function for consent changes.
   * @param callback - Function called with ConsentCategories when consent changes
   */
  onConsentChange(callback: Function): ConsentTracker {
    this.#callback.onConsentChange(callback)
    return this
  }

  // Wrapper function
  /**
   * Retrieves stored consents and validates they haven't expired.
   * @returns ConsentsWithTimeStamp object containing consent data and timestamp
   * @throws Error if no consents stored or consents have expired
   */
  getConsents(): ConsentsWithTimeStamp {
    return this.#localStorage.getConsents()
  }

  /**
   * Sets the webhook endpoint for consent notifications.
   * @param endpoint - URL where consent changes will be sent
   */
  setWebhook(endpoint: string): void {
    this.#webhook = new Webhook(endpoint)
  }

  /**
   * Enables more verbose console errors for the webhook.
   * @throws Error if webhook endpoint is not set first
   */
  setDeveloperMode() {
    if (this.#webhook) {
      this.#webhook.setDevelopmentMode()
    } else {
      throw new Error('The webhook endpoin needs to be set first')
    }
  }

  /**
   * Sets consent preferences and validates them.
   * @param consents - Object containing consent states for different categories
   */
  setConsents(consents: ConsentCategories): void {
    const falseConsents = this.#validator.validateFalseContents(consents)

    if (falseConsents) {
      this.#handleInvalidConsents()
    } else {
      this.#handleValidConsents(consents)
    }
  }

  /**
   * Updates a single consent category and validates the result.
   * @param category - The consent category to update
   * @param value - The boolean value to set for the category
   */
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
    let existingConsents: ConsentCategories | null = null

    try {
      existingConsents = this.#localStorage.getConsents()
    } catch (error) {}

    const consents: ConsentCategories = {
      essential: existingConsents?.essential ?? false,
      analytics: existingConsents?.analytics ?? false,
      marketing: existingConsents?.marketing ?? false
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

  /**
   * Accepts all consent categories (essential, analytics, marketing).
   */
  acceptAll(): void {
    const consentedAll = {
      essential: true,
      analytics: true,
      marketing: true
    }
    this.#handleValidConsents(consentedAll)
  }

  /**
   * Declines all consent categories and deletes the entry from the localstorage.
   */
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

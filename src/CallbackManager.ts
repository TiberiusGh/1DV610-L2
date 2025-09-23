import type { ConsentCategories } from './types'

export class CallbackManager {
  #callbackFunction: Function | null = null

  onConsentChange(callback: Function): void {
    this.#callbackFunction = callback
  }

  runCallback(consents: ConsentCategories | null = null): void {
    if (this.#callbackFunction) {
      this.#callbackFunction(consents)
    }
  }
}

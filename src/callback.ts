import type { ConsentCategories } from './types'

let callbackFunction: Function

export function onConsentChange(callback: Function) {
  callbackFunction = callback
}

export function runCallback(consents: ConsentCategories | null = null) {
  if (callbackFunction) {
    callbackFunction(consents)
  }
}

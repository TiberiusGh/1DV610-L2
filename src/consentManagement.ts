import type { ConsentCategories } from './types.ts'
import { runCallback } from './callback.js'
import { saveConsent, clearConsent } from './storageManagement.js'
import { validateFalseContents } from './validation.js'

export function setConsents(consents: ConsentCategories): void {
  const currentConsents = consents

  currentConsents.uppdateTime = new Date()

  const falseConsents = validateFalseContents(currentConsents)

  if (falseConsents) {
    clearConsent()
  } else {
    saveConsent(currentConsents)
  }
  runCallback(currentConsents)
}

export function uppdateConsent(category: string, value: boolean): void {
  let storedConsent: ConsentCategories | null

  try {
    const stored = localStorage.getItem('consent-tracker')
    storedConsent = stored ? JSON.parse(stored) : null

    if (storedConsent) {
      storedConsent.uppdateTime = new Date()
    }
  } catch (error) {
    storedConsent = null
  }

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
      storedConsent.uppdateTime = new Date()
      break

    case 'analytics':
      storedConsent.analytics = value
      storedConsent.uppdateTime = new Date()
      break

    case 'marketing':
      storedConsent.marketing = value
      storedConsent.uppdateTime = new Date()
      break
  }

  const falseConsents = validateFalseContents(storedConsent)

  if (falseConsents) {
    clearConsent()
  } else {
    saveConsent(storedConsent)
  }
  runCallback(storedConsent)
}

export function acceptAll(): void {
  const consentedAll = {
    essential: true,
    analytics: true,
    marketing: true,
    uppdateTime: new Date()
  }

  saveConsent(consentedAll)
  runCallback(consentedAll)
}

export function declineAll(): void {
  clearConsent()
  runCallback()
}

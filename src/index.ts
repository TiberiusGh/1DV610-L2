import type { ConsentCategories } from './types.ts'
import { onConsentChange, runCallback } from './callback.js'
import { saveConsent, clearConsent, getConsents } from './storageManagement.js'

export {
  getConsents,
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll,
  onConsentChange
}

function setConsents(consents: ConsentCategories): void {
  const currentConsents = consents

  currentConsents.uppdateTime = new Date()

  saveConsent(currentConsents)
  runCallback(currentConsents)
}

function uppdateConsent(category: string, value: boolean): void {
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

  saveConsent(storedConsent)
  runCallback(storedConsent)
}

function acceptAll(): void {
  const consentedAll = {
    essential: true,
    analytics: true,
    marketing: true,
    uppdateTime: new Date()
  }

  saveConsent(consentedAll)
  runCallback(consentedAll)
}

function declineAll(): void {
  clearConsent()
  runCallback()
}

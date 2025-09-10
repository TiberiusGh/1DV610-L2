type ConsentCategories = {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export function getConsents(): ConsentCategories | null {
  const storedConsent = localStorage.getItem('consent-tracker')

  if (!storedConsent) {
    return null
  }

  try {
    return JSON.parse(storedConsent)
  } catch (error) {
    return null
  }
}

export function setConsents(consents: ConsentCategories): void {
  localStorage.setItem('consent-tracker', JSON.stringify(consents))
}

export function uppdateConsent(category: string, value: boolean): void {
  let storedConsent: ConsentCategories | null

  try {
    const stored = localStorage.getItem('consent-tracker')
    storedConsent = stored ? JSON.parse(stored) : null
  } catch (error) {
    storedConsent = null
  }

  if (!storedConsent) {
    storedConsent = {
      essential: false,
      analytics: false,
      marketing: false
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

  localStorage.setItem('consent-tracker', JSON.stringify(storedConsent))
}

export function withdrawConsent(): void {
  localStorage.removeItem('consent-tracker')
}

export function acceptAll(): void {
  const consentedAll = {
    essential: true,
    analytics: true,
    marketing: true
  }

  setConsents(consentedAll)
}

export function declineAll(): void {
  withdrawConsent()
}

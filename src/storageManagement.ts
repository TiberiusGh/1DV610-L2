import type { ConsentCategories } from './types.js'
import { validateDate } from './validation.js'

export function getConsents(): ConsentCategories | null {
  const storedConsent = localStorage.getItem('consent-tracker')

  if (!storedConsent) {
    return null
  }

  try {
    const parsedConsents = JSON.parse(storedConsent)
    parsedConsents.uppdateTime = new Date(parsedConsents.uppdateTime)

    const isExpired = validateDate(parsedConsents.uppdateTime)

    if (!isExpired) {
      return parsedConsents
    } else {
      clearConsent()
      return null
    }
  } catch (error) {
    return null
  }
}

export function saveConsent(consent: ConsentCategories): void {
  localStorage.setItem('consent-tracker', JSON.stringify(consent))
}

export function clearConsent(): void {
  localStorage.removeItem('consent-tracker')
}

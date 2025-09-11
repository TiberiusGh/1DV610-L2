import type { ConsentCategories } from './types'

export function validateDate(storedDate: Date): boolean {
  const currentDate = new Date()
  const expirationDate = new Date(storedDate)
  expirationDate.setMonth(storedDate.getMonth() + 12)

  return currentDate > expirationDate
}

export function validateFalseContents(consents: ConsentCategories) {
  return !(consents.analytics || consents.essential || consents.marketing)
}

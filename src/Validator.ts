import { LocalStorage } from './LocalStorage'
import type { ConsentCategories, ConsentsWithTimeStamp } from './types'

export class Validator {
  validateFalseContents(consents: ConsentCategories): boolean {
    return !(consents.analytics || consents.essential || consents.marketing)
  }

  hasExpiredConsents(consents: ConsentsWithTimeStamp): boolean {
    const currentDate = new Date()
    const expirationDate = new Date(consents.consentDate)
    expirationDate.setMonth(expirationDate.getMonth() + 12)

    return currentDate > expirationDate // Returns true if expired
  }
}

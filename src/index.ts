import { onConsentChange } from './callback.js'
import { getConsents } from './storageManagement.js'
import {
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll
} from './consentManagement.js'

export {
  getConsents,
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll,
  onConsentChange
}

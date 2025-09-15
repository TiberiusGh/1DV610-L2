import { onConsentChange } from './callback.js'
import { getConsents } from './storageManagement.js'
import {
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll
} from './consentManagement.js'

const consentTracker = {
  getConsents,
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll,
  onConsentChange
}

export default consentTracker

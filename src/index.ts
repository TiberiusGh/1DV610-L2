type ConsentCategories = {
  essential: boolean
  analytics: boolean
  marketing: boolean
  uppdateTime: Date
}

let callbackFunction: Function

export function getConsents(): ConsentCategories | null {
  const storedConsent = localStorage.getItem('consent-tracker')

  if (!storedConsent) {
    return null
  }

  const parsedConsents = JSON.parse(storedConsent)
  parsedConsents.uppdateTime = new Date(parsedConsents.uppdateTime)

  try {
    const isExpired = validateDate(parsedConsents.uppdateTime)

    if (!isExpired) {
      return parsedConsents
    } else {
      declineAll()
      return null
    }
  } catch (error) {
    return null
  }
}

function validateDate(storedDate: Date): boolean {
  const currentDate = new Date()
  const expirationDate = new Date(storedDate)
  expirationDate.setMonth(storedDate.getMonth() + 12)

  return currentDate < expirationDate
}

export function setConsents(consents: ConsentCategories): void {
  const dataToStore = consents

  dataToStore.uppdateTime = new Date()

  localStorage.setItem('consent-tracker', JSON.stringify(dataToStore))
  runCallback()
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

  localStorage.setItem('consent-tracker', JSON.stringify(storedConsent))

  runCallback()
}

export function acceptAll(): void {
  const consentedAll = {
    essential: true,
    analytics: true,
    marketing: true,
    uppdateTime: new Date()
  }

  setConsents(consentedAll)
}

export function declineAll(): void {
  localStorage.removeItem('consent-tracker')
  runCallback()
}

export function onConsentChange(callback: Function) {
  callbackFunction = callback
}

function runCallback() {
  if (callbackFunction) {
    const currentConsents = getConsents()
    callbackFunction(currentConsents)
  }
}

import { vi, describe, test, expect, beforeEach } from 'vitest'
import consentTracker from '../src/index'

// const consentTracker = {
//   getConsents,
//   setConsents,
//   uppdateConsent,
//   acceptAll,
//   declineAll,
//   onConsentChange
// }

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
})

describe('getting consents', () => {
  test('consentTracker.getConsents should call localStorage.getItem', () => {
    consentTracker.getConsents()
    expect(localStorage.getItem).toHaveBeenCalled()
  })
})

describe('seting consents', () => {
  test('consentTracker.setConsents should call localStorage.setItem', () => {
    consentTracker.setConsents({
      essential: true,
      analytics: true,
      marketing: false
    })
  })

  test('consentTracker.setConsents should call localStorage.setItem', () => {
    // expect to call the callback function
  })
})

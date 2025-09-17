import { vi, describe, test, expect, beforeEach } from 'vitest'
import consentTracker from '../src/index'

test('onConsentChange should register callback function', () => {
  const mockCallback = vi.fn()

  expect(() => {
    consentTracker.onConsentChange(mockCallback)
  }).not.toThrow()
})

describe('setting consents', () => {
  test('consentTracker.setConsents should call localStorage.setItem', () => {
    const localStorageSpy = vi.spyOn(Storage.prototype, 'setItem')

    consentTracker.setConsents({
      essential: true,
      analytics: true,
      marketing: false
    })

    expect(localStorageSpy).toHaveBeenCalledWith(
      'consent-tracker',
      expect.stringMatching(
        /.*"essential":true.*"analytics":true.*"marketing":false.*/
      )
    )
  })
})

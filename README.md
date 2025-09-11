# consent-tracker

In this repository i am creating a module for managing consent from users (cookie-banner). The target of this package is developers that want full design customization posibility but that have underlying functionality that manages the user's consent. Simply put, a consent manager that doesn't fight design choices.

The module is using local storage to store the users.

The user's consents is valid for 12 months and removed after that.

### Public API's

- getConsents() - Returns the consents in object format or `null` if no consent is found

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  uppdateTime: Date
}
```

- acceptAll() - Accept all the consent categories (`essential`, `analytics`, `marketing`, `uppdateTime`)

- declineAll() - Removes/ deletes the consent object in storage

- onConsentChange(callbackFunction) - Callbackfunction for state change on consents

- setConsents(consents) - Updates consents in bulk

```js
{
  essential: true
  analytics: false
  marketing: true
}
```

- uppdateConsent(category, value) - Updates single category

```js
uppdateConsent(analytics, false)
```

### Future development

- Use cookies as fallback if there is no access to localstorage to store the users consents.

# consent-tracker

In this repository i am creating a module for managing consents from users regarding storing data on the user's browser. The target of this module is developers that want full design customization posibility for rendering choices. This module does only provide the underlying logic needed for storing retrieving and updating the consents trough trough easy to use function calls. The current available packages are either inferring their design choices with no posibility to change them or only allow customization of only specific parts of the banner. Simply put, a consent manager that doesn't fight design choices.

I understand that creating such a package is much more complex than the implementation provided here. Further improvements are registered under issues, and other important aspects that developers need to take into account will be posted here. Nevertheless, working with this package has given me knowledge about the current requirements regarding GDPR.

To maintain legal compliance, one must provide proof of users consents. This requires creating logs of user consents and storing them together with personal data (ex. IP addresses). This feature is not implemented in this module.

This module does **not** provide the visual banner that would get rendered in the viewport.

This module uses ES Modules and **not** CommonJS. Make sure you use `import` statements and not `reqire()`.

The module is using local storage to store the users consents. If consents are set to `false`, the value won't be stored on user's machine since that defies the purpose/th user didn't consent to that.

The user's consents is valid for 12 months and removed after that.

### Public API's

- onConsentChange(callbackFunction) - Callbackfunction for state change on consents. The method will return the consents in object form as:

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  uppdateTime: Date
}
```

- getConsents() - Returns the consents in object format or `null` if no consent is found

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  uppdateTime: Date
}
```

- acceptAll() - Accept all the consent categories (`essential`, `analytics`, `marketing`) and stores them

- declineAll() - Removes/ deletes the consent object in storage

- setConsents(consents) - Updates consents in bulk. The method takes an object argument as:

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

### Installation

`npm i consent-tracker`

```js
import {
  getConsents,
  setConsents,
  uppdateConsent,
  acceptAll,
  declineAll,
  onConsentChange
} from 'consent-tracker'
```

### Testing report is provided in [testReport.md](testReport.md)

### Future development

- Use cookies as fallback if there is no access to localstorage to store the users consents.

### Contributing

Found a bug or want to improve the code?

- Report issues here: [GitHub Issues](https://github.com/TiberiusGh/1DV610-L2/issues)
- Start a discussion here: [GitHub Discussions](https://github.com/TiberiusGh/1DV610-L2/discussions)

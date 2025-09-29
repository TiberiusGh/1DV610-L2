# consent-tracker

In this repository i am creating a module for managing consents from users regarding storing data on the user's "terminal". The target of this module is developers that want full design customization posibility for their cookie consent banner. This module does only provide the underlying logic needed for storing, retrieving and updating the consents trough trough easy to use function calls. The current available packages on NPM are either inferring their design choices on the banner. Simply put, a consent manager that doesn't fight design choices.

I understand that creating such a package is much more complex than the implementation provided here. Further improvements are registered under issues. Working with this package has given me knowledge about the current governing laws about "cookie" consent.

To maintain legal compliance, one must provide proof of users consents. This is by praxis done by creating and keeping logs of the user's consents. For the consents to be mapped to the right person, personal data in form of IP addresses needs to be provided in the logs. This feature has beed implemented by alowing users to add a webhook URL where the package would send the consents together with the IP of the user.

This module does **not** provide the visual banner that would get rendered in the viewport.

This module uses ES Modules and **not** CommonJS. Make sure you use `import` statements and not `reqire()`.

The module is using local storage to store the users consents. If consents are set to `false`, the value won't be stored on user's machine since that defies the purpose/th user didn't consent to that.

The user's consents is valid for 12 months and removed after that.

### Public API's

- onConsentChange(callbackFunction) - Registers a callback that runs when the consent state changes. The callback receives the current consents as an object:

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  consentDate: Date
}
```

- getConsents() - Returns the consents in object format or throws an error if no consent is found

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  consentDate: Date
}
```

- setWebhook(endpoint) - Registers API endpoint for the webhook and sends the current consents each time they update. The sent data is POST:en as:
  > The user's ip is discovered trough the dependency `ipify`

```js
essential: boolean
analytics: boolean
marketing: boolean
consentDate: Date
userIP: string
```

- setDeveloperMode() - Allows more permissive logs when seting up the webhooks. Helpful in debugging.

- setConsents(consents) - Updates consents in bulk. The method takes an object argument as:

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
}
```

- uppdateConsent(category, value) - Updates single category

```js
uppdateConsent('analytics', boolean)
```

- acceptAll() - Accept all the consent categories (`essential`, `analytics`, `marketing`) and stores them

- declineAll() - Removes/ deletes the consent object in storage

### Installation

`npm i consent-tracker`

#### Import the module as:

```js
import ConsentTracer from 'consent-tracker'
```

### Dependencyes

The module is using `ipify` to fetch the IP of the user leaving consents (if you are implementing webhook)

### Reflections

Reflections are provided in [reflections.md](docs/reflections.md)

### Testing

Manual tests are provided in [testingGuide.md](docs/testingGuide.md)

Test report is provided in [testReport.md](docs/testReport.md)

### Contributing

Found a bug or want to improve the code?

- Report issues here: [GitHub Issues](https://github.com/TiberiusGh/1DV610-L2/issues)
- Start a discussion here: [GitHub Discussions](https://github.com/TiberiusGh/1DV610-L2/discussions)

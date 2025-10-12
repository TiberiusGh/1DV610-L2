# consent-tracker

## Law requirements

According to Swedish law (lagen om elektronisk kommunikation) when a webbsite wants to store non-essential information (not strictly necessary for the website's basic functionality) on that person's browser, the person must give consent before such data is stored.

The European law (GDPR) regulates how personal information must be handled, stored, processed and protected if the webbsite chooses to store personal information about the website visitor. 

Furthermore, to maintain GDPR compoiance, a website owner must also provide proof of what consents each visitor has given.

<br>

## Purpose of `consent-tracker`

The aim of the module is to provide a simple interface for managing user's consents alowing developers full design customization posibility for their banner. Simply put, a consent manager that doesn't fight design choices.

<br>


## Functionality and limitations

This module does only provide the underlying logic needed for storing, retrieving and updating the consents trough easy to use function calls.

Providing proof of users consents is made possible trough a webhook implementation where on each consent change, it sends a POST request containg the user's consents and their IP at the provided webhook URL.

> [!WARNING]
> I understand that creating such a package is much more complex than the implementation provided here. Further improvements are registered under issues.


This module does **not** provide the visual banner that would get rendered in the viewport.

The module is using local storage to store the users consents and has no implementation of using cookies in it's current form.

If consents are set to `false`, the value won't be stored on user's machine since the user didn't consent to that.

The user's consents are valid for 12 months and get removed after that.


<br>

## Installation

`npm i consent-tracker`

Then import the module as:

```js
import ConsentTracker from 'consent-tracker'
```

<br>

## Public API's

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
> [!NOTE]
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

<br>


### Dependencyes

The module is using `ipify` to fetch the IP of the user leaving consents (if you are implementing webhook)

<br>

### Reflections

Reflections are provided in [reflections.md](docs/reflections.md)

<br>

### Testing

Manual tests are provided in [testingGuide.md](docs/testingGuide.md)

Test report is provided in [testReport.md](docs/testReport.md)

<br>

### Contributing

Found a bug or want to improve the code?

- Report issues here: [GitHub Issues](https://github.com/TiberiusGh/1DV610-L2/issues)
- Start a discussion here: [GitHub Discussions](https://github.com/TiberiusGh/1DV610-L2/discussions)

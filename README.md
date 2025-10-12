# consent-tracker

## Law requirements

According to Swedish law (lagen om elektronisk kommunikation) when a webbsite wants to store non-essential information (not strictly necessary for the website's basic functionality) on that user's browser, the user must give consent before such data is stored. GDPR further regulates how personal information must be handled and protected and require wwebsite owners to provide prof of specific user's consents. 

<br>

## Purpose of `consent-tracker`

The aim of the module is to provide a simple interface for managing user's consents alowing developers full design customization posibility for their banner. Simply put, a consent manager that doesn't fight design choices.

<br>


## Functionality and limitations

This module does only provide the underlying logic for storing, retrieving and updating the consents trough simple function calls.

Providing proof of users consents is made possible trough a webhook that sends a POST request containg the user's consents and their IP at the provided webhook URL.

This module does **not** provide the visual banner that would get rendered in the viewport.

The module is using local storage to store the users consents.

If consents are set to `false`, the value won't be stored on user's machine since the user didn't consent to that.

The user's consents are valid for 12 months and automatically removed after that.


<br>

## Installation

`npm i consent-tracker`

Then import and use the module as:

```js
import ConsentTracker from 'consent-tracker'

const consentTracker = new ConsentTracker()

consentTracker.uppdateConsent('analytics', true)
```

<br>

## Public API's

All methods that return or send consent data use the following structure:

```js
{
  essential: boolean
  analytics: boolean
  marketing: boolean
  consentDate: Date
}
```

- onConsentChange(callbackFunction) - Registers a callback that runs when the consent state changes. The callback receives the current consents as an object:


- getConsents() - Returns the consents in object format or throws an error if no consent is found


- setWebhook(endpoint) - Registers API endpoint for the webhook and sends the current consents each time they update. The sent data is POST:en as:

```js
{
essential: boolean
analytics: boolean
marketing: boolean
consentDate: Date
userIP: string
}
```
> [!NOTE]
> The user's ip is discovered trough the dependency `ipify`


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

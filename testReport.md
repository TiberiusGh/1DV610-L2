The module has been tested using manual test cases trough a web interface pubished on github at [TiberiusGh/L2-Test](https://github.com/TiberiusGh/L2-Test).

The web interface contains buttons that triggers different method calls in the public interface of this module.

To assist in checking what is stored in the browser's local storage a `<pre>` element renders what `consent-tracker` is storing in localstorage. The text in the `<pre>` element is updated trough calback function provided in this module.

The specific test cases are:

- Retrieving current consents by pressing the "Get consents" `<button>`

  - returns `null` if there are no consents stored or if the users deny all consents
  - returns a `object` containing consents (if there is at least one cattegory accepted by the user) and a Date `object`
    > Test passed ✅ at v. 1.0.1

- Essentials, Marketing, Analytics on/ off

  - Pressing the `on` button saves the essentials/ marketing/ analytics as true in localstorage
  - Pressing the `off` button saves the essentials/ marketing/ analytics as false in localstorage
    > Obs. if there are no other category set to true, the data would be removed from localstorage and the function would return `null`.
  - The Date `object` is uppdated containing the Date with timestamp of when the user updated consents latest.
    > Test passed ✅ at v. 1.0.1

- Accept/ Reject All

  - Accept all would set the consents for essentials, marketing, analytics to `true`
  - Reject all would delete the consents stored in localstorage
    > Test passed ✅ at v. 1.0.1

- Set custom consents 1/ 2 tests setting custom values in bulk for the consent categories.

  - For custom consents 1 the consents are: essential: false, analytics: true, marketing: true. Those should be stored in localstorage alongside a `Date object` containing the timestamp of the consent.
  - For custom consents 2 the consents are: essential: true, analytics: true, marketing: false. Those should be stored in localstorage alongside a `Date object` containing the timestamp of the consent.
    > Test passed ✅ at v. 1.0.1

- The callback function is tested by updating the text content of the `<pre>` element at each change of the consents.
  > Test passed ✅ at v. 1.0.1

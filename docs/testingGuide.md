# Manual test description

## Test environment setup

The module has been tested using manual test cases trough a web interface pubished on github at [TiberiusGh/L2-Test](https://github.com/TiberiusGh/L2-Test).

The web interface contains buttons that triggers different method calls in the public interface of this module.

To assist in checking what is stored in the browser's local storage a `<pre>` element renders what `consent-tracker` is storing in localstorage. The text in the `<pre>` element is updated trough calback function provided in this module.

## Test cases

### 1. Get Current Consent

Function Under Test: getConsents()

#### 1a. - Empty State Test

Steps:

1. Start with a clean browser session (clear localStorage if needed)
2. Click the "Get consents in console" button
3. Observe the result in the console

Expected Results:

The console should throw error saying that there are no stored consents

### 1b. Get Current Consents - With Stored Consents Test

Steps:

1. Set some consents (e.g., click "Essentials ON" and "Marketing ON")
2. Observe the result in localstorage or in the `<pre>` element

Expected Results:

The `pre` element should display an object containing the consents you set and a `Date` object

### 2. Individual Consent Updates Test

Function Under Test: updateConsent(category, value)

Steps:

1. Start with a clean localStorage
2. Click "Essentials ON" button
3. Check the `<pre>` element content and localStorage
4. Click "Marketing ON" button
5. Check the `<pre>` element content and localStorage
6. Click "Analytics OFF" button (should have no effect since it wasn't on)
7. Click "Essentials OFF" button
8. Check the `<pre>` element content and localStorage
9. Click "Marketing OFF" button
10. Check the `<pre>` element content and localStorage

Expected Results:

Step 3: localStorage contains {essential: true} with timestamp
Step 5: localStorage contains {essential: true, marketing: true} with updated timestamp
Step 6: No change in localStorage
Step 8: localStorage contains {marketing: true} with updated timestamp
Step 10: localStorage is empty/null (all consents false)

### 3. Accept/Reject All Test

Functions Under Test: acceptAll() and declineAll()

Steps:

1. Start with clean localStorage
2. Click "Accept All" button
3. Check the `<pre>`element and localStorage content
4. Click "Reject All" button
5. Check the `<pre>` element and localStorage content
6. Set some individual consents
7. Click "Accept All" button again
8. Check the `<pre>` element and localStorage content

Expected Results:

Step 3: All categories (essential, marketing, analytics) set to true with timestamp
Step 5: localStorage is empty/cleared
Step 8: All categories set to true with new timestamp (overwriting previous settings)

### 4. Set Custom Consents Test

Function Under Test: setConsents(consents)

Steps:

1. Start with clean localStorage
2. Click "Set custom consents 1" button
3. Check the `<pre>` element and localStorage content
4. Click "Set custom consents 2" button
5. Check the `<pre>` element and localStorage content

Expected Results:

Step 3: localStorage shows {essential: false, analytics: true, marketing: true} with timestamp
Step 5: localStorage shows {essential: true, analytics: true, marketing: false} with new timestamp

### 5. Consent Change Callback Test

Function Under Test: onConsentChange(callbackFunction)
Steps:

1. Observe the initial `<pre>` element content
2. Click any consent modification button (e.g., "Essentials ON", "Accept All", "Set Custom Consents 1", etc.)
3. Observe that the `<pre>` element updates immediately
4. Repeat step 2 with different buttons
5. Each time, verify the `<pre>`element reflects the new state

Expected Results:

- The `<pre>` element should automatically update after every consent change
- The displayed content should always match the current consent state
- No manual refresh or additional button clicks should be needed

### 6. Webhook Test

Function Under Test: Webhook.sendData()

Steps:

1. Open browser developer tools and go to Network tab
2. Set up a webhook url in the `<input>` (recommend using webhook.site but remember to enable CORS in the config on webhook.com)
3. Click "Accept All" button
4. Check the Network tab for a POST request to the webhook endpoint
5. Click "Essentials OFF" button
6. Check the Network tab for another POST request

Expected Results:

- Each consent change should trigger a POST request in the Network tab
- The request should contain consent data with IP address

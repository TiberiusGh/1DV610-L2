# Naming

| Namn                                             | Förklaring                                                               | Reflektion och regler från Clean Code                                                                                                                                                                                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getConsents()                                    | Retrieves the consents stored in localStorage.                           | The function name is intention revealing. One could be more explicit and change it to `getStoredConsents()`. The name is short but is not so short that it gets unclear.                                                                                                                |
| setConsents(consents: ConsentCategories)         | Stores the consents in localStorage                                      | The function uses a pronounceable name, is neither disinformative nor uninformative and uses a verb as the identifier of the function.                                                                                                                                                  |
| uppdateConsent(category: string, value: boolean) | Updates only one category of the consents and stores                     |
| acceptAll()                                      | Sets the consents categories to `true` and saves them in localstorage    | The current name is somewhat `cute` since using it in the context of accepting all cookie credentials but it's the identifyer acceptAll is more generic than that and can be applyied in other contexts as well. A more suitable name for the function would be `acceptAllCredentials`. |
| onConsentChange()                                | It's the name of the callback function that would get sent to the module | The naming of the function is disinformative. The on prefix is often used as event handlers but also that the name does not communicate the right intent. Since the function is registering a callback function a more suitable name for it would be `registerCallbackFuncion`          |

# Naming reflection

I understand and agree with the fact that writing good naming helps in the long run. Finding the right word is challenging, especially when juggling multiple languages mentally, where you might know the perfect term in one language but struggle to recall its equivalent in another. There's also the fact that a name might seem like a good name when writing it but might not make so much sense after a while. The book's recommendation to update names as better ones emerge feels liberating, as it allows for forward code momentum and acceptance of changing/ improving names along the way.

# Functions

| Metodnamn                                                 | Länk eller kod                       | Antal rader (ej ws) | Reflektion                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------- | ------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function uppdateConsent(category: string, value: boolean) | [See original code](#uppdateconsent) | 48                  | **Do one thing:** The function does definnetely more than one thing in it's original form. For example the function does do validation as well as adding a `Date` object to the consents obejct.<br>**One level of abstraction:** The function operates at diferent levels of abstractions whereas I am creating objects, as well as calling other abstract functions <br> **Side effects:** A `Date` object is added/ overwritten on the retrieved object or added to the newly created object. <br> **Naming:** I believe that the naming of the function is good since it conveys meaning, is in singular which hints at it changing only one consent cattegory and it does not imply that it would return something. <br> **Nr. of arguments** The function takes two arguments (dyadic) which i believe is justified for it's purpose. A refactoring suggestion would be to change so that the function would take an object containing the category and the value as one single argument. I suspect that such a refactoring may be used soon when i will break the function into smaller functions. |
| function getConsents()                                    | [See original code](#getconsents)    | 18                  | **Do one thing:** The function does more than one thing. It's retrieving data and validating different parameters. The error handling is **one thing** so it should itself be a function call instead. <br> **Mixed return types:** The funciton does have mixed return types. It can either return an object containing the accepted credentials or `null` if there is no consents stored (or every consent set to `false`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| setConsents(consents: ConsentCategories)                  | [See original code](#setconsents)    | 12                  | In this function i repeat some of the same pitfalls as in with earlyer functions, such as more than one thing, having side effects (by calling diferent other functions) and it works on different levels of abstraction.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| acceptAll()                                               | [See original code](#acceptall)      | 10                  | **Do one thing:** The code does more than one thing but it's now not as complex as other functions and it's easyer to understand. The creation of the credentialobject should be extracted into another function. <br> **Naming:** The current naming is too vague, a more descriptive name would be `acceptAllConsentCredentials`. Such a name would make the function's purpose clearer and improve readability.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| validateDate()                                            | [See original code](#validatedate)   | 5                   | **Naming:** Since the function returns boolean, i believe that a more suited name would be `isDateValid`. Otherwise i believe that the function is small enough, it does one thing and does it well.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

## uppdateConsent()

```js
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

  const falseConsents = validateFalseContents(storedConsent)

  if (falseConsents) {
    clearConsent()
    runCallback()
  } else {
    saveConsent(storedConsent)
    runCallback(storedConsent)
  }
}
```

## getConsents()

```js
export function getConsents(): ConsentCategories | null {
  const storedConsent = localStorage.getItem('consent-tracker')

  if (!storedConsent) {
    return null
  }

  try {
    const parsedConsents = JSON.parse(storedConsent)
    parsedConsents.uppdateTime = new Date(parsedConsents.uppdateTime)

    const isExpired = validateDate(parsedConsents.uppdateTime)

    if (!isExpired) {
      return parsedConsents
    } else {
      clearConsent()
      return null
    }
  } catch (error) {
    return null
  }
}
```

## setConsents()

```js
export function setConsents(consents: ConsentCategories): void {
  const currentConsents = consents

  currentConsents.uppdateTime = new Date()

  const falseConsents = validateFalseContents(currentConsents)

  if (falseConsents) {
    clearConsent()
    runCallback()
  } else {
    saveConsent(currentConsents)
    runCallback(currentConsents)
  }
}
```

## acceptAll()

```js
export function acceptAll(): void {
  const consentedAll = {
    essential: true,
    analytics: true,
    marketing: true,
    uppdateTime: new Date()
  }

  saveConsent(consentedAll)
  runCallback(consentedAll)
}
```

## validateDate()

```js
export function validateDate(storedDate: Date): boolean {
  const currentDate = new Date()
  const expirationDate = new Date(storedDate)
  expirationDate.setMonth(storedDate.getMonth() + 12)

  return currentDate > expirationDate
}
```

# Function reflection

One thing that i seem to recursevly do in my functions is that i retrieve the data that is stored in localstorage each time in the beginning of the function and then do some logic with the data in localstorage. Since my code needs to have the latest data that is stored in local storage, it seems reasonable to retrieve it before each operation but then it seems like my functions do more than one thung by retrieving the data and then making some operations on it. I will try to refactor my code after L2 completing this review. I suspect that this problem can be fixed by breaking the functions into smaller functions. Another place where i am repeating code is where i would call the callback function. The callback function should be triggered after each change in the consents. I've made a function that is called and triggers the callback but is the repeating of the function call counted as repeating code?

I have also a hard time comming up with a solution regarding mixed return types. When there are no stored credentials, the return would be `null`. If the user has a change of mind and changing the consents to false, then the module would have to set the consents to false but since the user does not agree to storing the data in localstorage, i cannot save consents and need to delete them. The returning object would thus be `null`. It seems like, somewhere in my code, in an very abstract function, i do need to return either an object or `null`.

# Main reflections

The book argues that writing code is like writing on paper. First you put your thoughts into words. After that you "massage" it so it reads well and that reading code should feel as easy to read as reading a story. My code in it's current form, when writing this reflection, does not feel like reading a story and it needs refactoring. I've found it interesting that recognizing clean code does not necesarrly translate to writing good code which resonates with my current knowledge and code. The books analogy between a house with a broken window and code resonate with me and i can see the value in writing code "with care" so that others would also care about my code and thus incetivize to improve my code project.
I've observed that I find it challenging to break down complex logic into small functions from the beningin. I typically find myself using one of two patterns: either creating a `main` function in which i sequentially call multiple small functions (ex. fetchData(), validateData(), doOperationOnData(), storeData() ) or building function chains where each function invokes the next one.

Reading the book made me realise that I indeed read more code that I am writing. This is something that i haven't given so much thought about before reading the book's chapter. The importance of good naming and creating readable code does suddenly feel a lot more justified and important than before.

Some roadblocks for me in applying the principles described in the book is the fact that as a beginner in proggraming, I am not allways sure how a problem would be tackled and somethimes it's neccessary for me to test different solutions for me to get a better grip of the problem and come up with a solution. In those situations it feels like clean code can't be prioritized and taken into account but that when a solution for the code materialize, the code would have to be refactored to apply clean code. I suspect that this situation would become less and less present the more experience i get into code. Nevertheless i believe it's good that i have some principles that tell me what to aim for and how i should write my code.

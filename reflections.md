# Namngivning

| Namn          | Förklaring                             | Reflektion och regler från Clean Code                                                                                                                                                                                                                                                                                                       |
| ------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tokenizer2000 | RadKlassnamn på huvudklassen i modulen | Avoid Disinformation: 2000 betyder inget speciellt och tillför därför inget till namnet. Don’t Be Cute: Namnet kan verka sött men är vilseledande. De som inte är millennium-romantiker kan missa det roliga. Bara “Tokenizer” är ett tydligare namn. Jag väljer dock att behålla Tokenizer2000 eftersom användare redan använder min modul |
|               |
| Rad 2, Cell 1 | Rad 2, Cell 2                          | Rad 2, Cell 3                                                                                                                                                                                                                                                                                                                               |
| Rad 2, Cell 1 | Rad 2, Cell 2                          | Rad 2, Cell 3                                                                                                                                                                                                                                                                                                                               |
| Rad 2, Cell 1 | Rad 2, Cell 2                          | Rad 2, Cell 3                                                                                                                                                                                                                                                                                                                               |
| Rad 2, Cell 1 | Rad 2, Cell 2                          | Rad 2, Cell 3                                                                                                                                                                                                                                                                                                                               |

Reflektion namngivning

# Funktioner

| Metodnamn                                                 | Länk eller kod                             | Antal rader (ej ws) | Reflektion                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------- | ------------------------------------------ | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function uppdateConsent(category: string, value: boolean) | [Se ursprunglig kod](<##uppdateConsent()>) | 48                  | **Do one thing:** The function does definnetely more than one thing in it's original form. For example the function does do validation as well as adding a `Date` object to the consents obejct.<br>**One level of abstraction:** The function is at diferent levels of abstractions whereas i am bot creating objects but also using my custom created type (painted type) as well as calling other abstract functions made by me <br> **Side effects:** A `Date` object is added/ overwritten on the retrieved object or added to the newly created object. <br> **Naming:** I believe that the naming of the function is good since it conveys meaning and it does not imply that it would return something. <br> **Nr. of arguments** The function takes two arguments which i believe is reasonable for it's purpose. A refactoring suggestion would be to change so that the function would take an object containing the category and the value. I suspect that such a refactoring may be relevant soon when i will break the function into smaller functions. |
| function getConsents()                                    | [Se ursprunglig kod](<##getConsents()>)    | 18                  | **Do one thing:** The function does do more than one thing. It's retrieving data and validating different parameters. <br> **Mixed return types:** The funciton does have mixed return types. It can either return an object containing the accepted credentials or `null` if there is no consents stored (or every consent set to `false`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| setConsents(consents: ConsentCategories)                  | [Se ursprunglig kod](<##setConsents()>)    | 12                  | In this function i repeat some of the same pitfals as in with earlyer functions. 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Rad 2, Cell 1                                             | Rad 2, Cell 2                              | Rad 2, Cell 3       | Rad 1, Cell 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Rad 2, Cell 1                                             | Rad 2, Cell 2                              | Rad 2, Cell 3       | Rad 1, Cell 3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

One thing that i seem to recursevly do in my functions is that i retrieve the data that is stored in localstorage each time in the beginning of the function and then do some logic with the data in localstorage. Since my code needs to have the latest data that is stored in local storage, it seems reasonable to retrieve it before each operation but then it seems like my functions do more than one thung by retrieving the data and then making some operations on it. I will try to refactor my code after L2 deadline. I suspect that this problem can be fixed by breaking the functions into smaller functions.

I have also a hard time comming up with a solution regarding mixed return types. When there are no stored credentials, the return would be `null`. If the user has a change of mind and changing the consents to false, then the module would have to set the consents to false but since the user does not agree to storing the data in localstorage, i cannot save consents and need to delete them. The returning object would thus be `null`. It seems like, somewhere in my code, in an very abstract function, i do need to return either an object or `null`.

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

Reflektion över egen kodkvalitetdadssad

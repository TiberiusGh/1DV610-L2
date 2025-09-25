export type ConsentCategories = {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export type ConsentsWithTimeStamp = ConsentCategories & {
  consentDate: Date
}

export type ConsentsWithDateAndIP = ConsentsWithTimeStamp & {
  userIP: string
}

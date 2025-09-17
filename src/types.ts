export type ConsentInput = {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

export type ConsentCategories = ConsentInput & {
  uppdateTime: Date
}

export function validateDate(storedDate: Date): boolean {
  const currentDate = new Date()
  const expirationDate = new Date(storedDate)
  expirationDate.setMonth(storedDate.getMonth() + 12)

  return currentDate < expirationDate
}

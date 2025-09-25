import type { ConsentsWithTimeStamp, ConsentsWithDateAndIP } from './types'

export class Webhook {
  #endpoint: string
  #publicAPIReturningIP = 'https://api.ipify.org?format=json'
  #devloperMode: boolean | null = null

  constructor(endpoint: string) {
    this.#endpoint = endpoint
  }

  async sendData(data: ConsentsWithTimeStamp): Promise<any> {
    const dataWithIP = await this.#addIP(data)

    try {
      const response = await fetch(this.#endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataWithIP)
      })

      if (!response.ok && this.#devloperMode) {
        throw new Error(`HTTP POST error. Status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      if (this.#devloperMode) {
        throw new Error(
          'POST error' + 'Error message: ' + (error as Error).message
        )
      }
    }
  }

  setDevelopmentMode() {
    this.#devloperMode = true
  }

  async #addIP(data: ConsentsWithTimeStamp): Promise<ConsentsWithDateAndIP> {
    const IP = await this.#fetchCurrentIP()

    return { ...data, userIP: IP }
  }

  async #fetchCurrentIP(): Promise<string> {
    try {
      const response = await fetch(this.#publicAPIReturningIP)

      if (!response.ok && this.#devloperMode) {
        throw new Error(`Fetching IP failed. Status: ${response.status}`)
      }

      const data = await response.json()
      return data.ip
    } catch (error) {
      throw new Error('Error in fetchin IP: ' + error)
    }
  }
}

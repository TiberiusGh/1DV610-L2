import type { ConsentsWithTimeStamp, ConsentsWithDateAndIP } from './types'

export class Webhook {
  #endpoint: string
  #publicAPIReturningIP = 'https://api.ipify.org?format=json'
  #devloperMode: boolean | false = false

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

      if (!response.ok) {
        this.#throwError(response)
      }
    } catch (error) {
      this.#throwError(error)
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

      if (!response.ok) {
        this.#throwError(response)
      }

      const data = await response.json()
      return data.ip
    } catch (error) {
      this.#throwError(error)
    }
  }

  #throwError(error: unknown): never {
    const errorMessage = this.#createErrorMessage(error)
    if (this.#devloperMode) {
      throw new Error(errorMessage)
    } else {
      throw new Error('Something went wrong')
    }
  }

  #createErrorMessage(error: unknown): string {
    let message: string

    if (error instanceof Error) {
      message = error.message
    } else if (error instanceof Response) {
      message = `HTTP Error: ${error.status} ${error.statusText}`
    } else if (typeof error === 'string') {
      message = error
    } else {
      message = 'Unknown error occurred'
    }

    return message
  }
}

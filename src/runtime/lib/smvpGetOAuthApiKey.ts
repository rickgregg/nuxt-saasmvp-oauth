// smvpGetOAuthApiKey.ts
import { useInit } from '../composables/useInit'

export const smvpGetOAuthApiKey = async (acctNum: string) => {
  if (!useInit.getInit()) {
    throw new Error ('nuxt-saasmvp-oauth: You need to run smvpInitAuth() in your app FIRST')
  }

  let status: number = 0
  let apiKey: string | null = null
  const body = Object.assign(
    {},
    // Authorization Grant
    {
      iss: 'saasmvp',
      sub: 'api-token',
      jti: null,
      acctno: acctNum,
      ts: Math.floor(Date.now() / 1000), // time of token request
    },
  )
  try {
    // wait for the `fetch()` call to be settled
    const response = await fetch('/api/smvp/smvp-api-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    // wait for the `response.json()` call to be settled
    const json = await response.json()
    status = json.status
    if (status == 200) {
      apiKey = json.data.token
    }
    else {
      // error
      apiKey = null
    }
  }
  catch (error) {
    console.log(error)
  }
  return apiKey
}

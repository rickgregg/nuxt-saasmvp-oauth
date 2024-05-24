// smvpGetOAuthToken.ts
import { useAuth } from '../composables/useAuth'
import { useInit } from '../composables/useInit'

export const smvpGetOAuthToken = async (username: string, password: string): Promise<number> => {
  if (!useInit.getInit()) {
    throw new Error(
      'nuxt-saasmvp-oauth: You need to run smvpInitAuth() in your app FIRST',
    )
  }

  let status: number = 0
  const body = Object.assign(
    {},
    // Authorization Grant
    {
      iss: 'saasmvp',
      sub: 'user-token',
      jti: null,
      username: username,
      password: password,
      ts: Math.floor(Date.now() / 1000), // time of token request
    },
  )

  try {
    // wait for the `fetch()` call to be settled
    const response = await fetch('/api/smvp/smvp-user-token', {
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
      useAuth.setToken(json.data.token)
    }
    else {
      // error
      useAuth.setLogout()
    }
  }
  catch (error) {
    console.log(error)
  }
  //
  return status
}

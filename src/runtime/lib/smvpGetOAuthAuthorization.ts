// smvpGetOAuthAuthorization.ts
import { useAuth } from '../composables/useAuth'
import { useInit } from '../composables/useInit'

export const smvpGetOAuthAuthorization = async (): Promise<number> => {
  if (!useInit.getInit()) {
    throw new Error ('nuxt-saasmvp-oauth: You need to run smvpInitAuth() in your app FIRST')
  }

  let status: number = 0

  // get authentication state
  const token: string | null = useAuth.getToken()

  try {
    // wait for the `fetch()` call to be settled
    const response = await fetch('/api/smvp/smvp-authorize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': token,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    // wait for the `response.json()` call to be settled
    const json = await response.json()
    status = json.status
  }
  catch (error) {
    console.log(error)
  }
  return status
}

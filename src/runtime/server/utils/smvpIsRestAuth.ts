// smvpIsRestAuth.ts
import { useRestAuth } from '../../composables/useRestAuth'

export const smvpIsRestAuth = () => {
  return useRestAuth.getAuth()
}

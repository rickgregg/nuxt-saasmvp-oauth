// smvpLogout.ts
import { useAuth } from '../composables/useAuth'
import { useLog } from '../composables/useLog'

export const smvpLogout = async (): Promise<boolean> => {
  useAuth.setLogout()
  if (!useAuth.getLogin() && useLog.getLogFlag()) {
    console.log(
      new Date(),
      'saasmvp OAUTH smvpLogout.ts STATUS: Logout SUCCESSFUL')
    return true
  }
  else {
    console.log(
      new Date(),
      'saasmvp OAUTH smvpLogout.ts STATUS: ERROR on Logout')
    return false
  }
  //
}

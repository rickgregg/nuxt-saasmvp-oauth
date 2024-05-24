// smvpInitAuth.ts
/* eslint no-self-assign: 0 */
import { useInit } from '../composables/useInit'
import { useLog } from '../composables/useLog'
import { useRoute } from '../composables/useRoute'

interface Options {
  logFlag?: boolean // optional
  redirectRoute?: string // optional
}

export const smvpInitAuth = async (options: Options): Promise<boolean> => {
  // set defaults if needed, logFlag = false, redirectRoute = '/' (Home Page)
  options.logFlag === undefined
    ? (options.logFlag = false)
    : (options.logFlag = options.logFlag)
  options.redirectRoute === undefined
    ? (options.redirectRoute = '/')
    : (options.redirectRoute = options.redirectRoute)

  // initialize client state
  useLog.setLogFlag(options.logFlag)
  useRoute.setRoute(options.redirectRoute)
  useInit.setInit(true)
  if (useLog.getLogFlag())
    console.log(
      new Date(),
      'saasmvp OAUTH smvpInitAuth.ts client INITIALIZED',
    )
  return true
}

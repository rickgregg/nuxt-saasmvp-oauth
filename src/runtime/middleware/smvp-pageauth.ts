// smvp-pageauth.ts client middleware
// NOTE: PAGE AUTHENTICATION (SEE smvp-apiauth.ts for API ENDPOINT AUTHENTICATION)

import { useAuth } from '../composables/useAuth'
import { useLog } from '../composables/useLog'
import { useRoute } from '../composables/useRoute'
import { smvpGetOAuthAuthorization } from '../lib/smvpGetOAuthAuthorization'
import {
  addRouteMiddleware,
  defineNuxtPlugin,
  callWithNuxt,
  useNuxtApp,
  navigateTo,
} from '#app'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('smvp-pageauth', async (to) => {
    const nuxtApp = useNuxtApp()

    // check if user logged in
    if (useAuth.getToken() === null) {
      if (useLog.getLogFlag())
        console.log(
          new Date(),
          'saasmvp OAUTH smvp-pageauth.ts client middleware: ROUTE:',
          to.path,
          '*** UNAUTHORIZED ***',
        )
      return callWithNuxt(nuxtApp, navigateTo, [useRoute.getRoute()])
    }

    // token still valid?
    let status: number = 0
    status = await smvpGetOAuthAuthorization()
    if (status == 200) {
      // token valid
      if (useLog.getLogFlag())
        console.log(
          new Date(),
          'saasmvp OAUTH smvp-pageauth.ts client middleware: ROUTE:',
          to.path,
          '*** AUTHORIZED ***',
        )
    }
    else {
      // token expired
      if (useLog.getLogFlag())
        console.log(
          new Date(),
          'saasmvp OAUTH smvp-pageauth.ts client middleware: ROUTE:',
          to.path,
          '*** JWT Token Expired ***',
        )
      useAuth.setLogout()
      return callWithNuxt(nuxtApp, navigateTo, [useRoute.getRoute()])
    }
    //
    // okay to keep going
    //
  })
})

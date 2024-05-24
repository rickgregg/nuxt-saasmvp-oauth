// smvp-apiauth.ts server middleware
// NOTE: API SERVER ENDPOINT AUTHENTICATION (SEE smvp-pageauth.ts FOR PAGE AUTHENTICATION)

// @ts-expect-error: Could not find a declaration file for module jsonwebtoken
import jwt from 'jsonwebtoken'

// https://github.com/nuxt/nuxt/issues/25571
import { defineNitroPlugin, useStorage } from 'nitropack/runtime'
import { useRestAuth } from '../../composables/useRestAuth'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    // read configuration data
    const logFlag = (await useStorage('redis').getItem('logFlag')) as boolean
    const protect = (await useStorage('redis').getItem('protect')) as string[]
    const jwtSecretKey = (await useStorage('redis').getItem(
      'jwtKey',
    )) as string

    // get route and headers from request
    const route = event.node.req.url as string
    const rawHeaders = event.node.req.rawHeaders

    let optionsFlag = false
    if (event.method == 'OPTIONS') {
      // ignore logging when method is OPTIONS
      optionsFlag = true
    }

    // authenticate protected route
    if (isProtectedRoute(protect, route, logFlag, optionsFlag)) {
      useRestAuth.setAuth(true)
      let token: string | null = null

      // retrieve token from headers
      // SEE: https://github.com/nuxt/nuxt/discussions/24220#discussioncomment-7527473
      if (rawHeaders.includes('X-TOKEN')) {
        token = rawHeaders[rawHeaders.indexOf('X-TOKEN') + 1]
      }
      else {
        if (rawHeaders.includes('x-token')) {
          token = rawHeaders[rawHeaders.indexOf('x-token') + 1]
        }
        else {
          // error - no jwt token in headers
          if (logFlag && !optionsFlag) console.log(
            new Date(),
            'saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authentication ERROR: NO X-TOKEN in Request Header')
          useRestAuth.setAuth(false)
        }
      }

      if (useRestAuth.getAuth()) {
        // validate token
        let decoded
        const now = Math.floor(Date.now() / 1000)
        try {
          decoded = jwt.verify(token, jwtSecretKey)
          if (logFlag)
            console.log(
              new Date(),
              'saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authenticated NOW:',
              now,
              'EXPIRES:',
              decoded.exp,
            )
        }
        catch (error) {
          // error - token malformed or expired
          if (logFlag) console.log(
            new Date(),
            'saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authentication ERROR: TOKEN MALFORMED OR EXPIRED')
          useRestAuth.setAuth(false)
        }
      }// eo if
    }// eo if

    //
    // keep going
    //
  })
})

const isProtectedRoute = (
  protect: string[],
  route: string,
  logFlag: boolean,
  optionsFlag: boolean,
) => {
  // check for empty protect array
  if (protect.length == 0 && logFlag) {
    console.log(
      new Date(),
      'saasmvp OAUTH smvp-apiauth.ts server middleware: NO ROUTES TO PROTECT',
    )
    return false
  }

  let strictFlag: boolean = false
  let wildcardFlag: boolean = false

  for (let i = 0; i < protect.length; i++) {
    // check for wildcard route
    /* eslint prefer-regex-literals: 0 */
    /* eslint regexp/no-unused-capturing-group: 0 */
    /* eslint regexp/no-useless-flag: 0 */
    const regexWildcardRoute = new RegExp(
      '/api/v([1-9]|[1-9]\\d)/.+/\\*',
      'g',
    )
    if (regexWildcardRoute.test(protect[i])) {
      wildcardFlag = route.includes(protect[i].slice(0, -2))
      if (wildcardFlag) {
        break
      }
    }

    // check for strict route
    const regexStrictRoute = new RegExp(
      '^/api/v([1-9]|[1-9]\\d)/.+[a-z]$',
      'g',
    )
    if (regexStrictRoute.test(protect[i])) {
      if (protect[i] == route) {
        strictFlag = true
        if (strictFlag) {
          break
        }
      }
    }
  }// eo for

  if (wildcardFlag || strictFlag) {
    // protected route
    if (logFlag && !optionsFlag)
      console.log(
        new Date(),
        'saasmvp OAUTH smvp-apiauth.ts server middleware: ROUTE:',
        route,
        '*** PROTECTED ***',
      )
    return true
  }
  else {
    // un-protected route
    if (logFlag)
      console.log(
        new Date(),
        'saasmvp OAUTH smvp-apiauth.ts server middleware: ROUTE:',
        route,
        '*** UNPROTECTED ***',
      )
    return false
  }
}

// authorize.post.ts
// @ts-expect-error: Could not find a declaration file for module jsonwebtoken
import jwt from 'jsonwebtoken'
import { defineEventHandler } from 'h3'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
  // read configuration data
  const logFlag = (await useStorage('redis').getItem('logFlag')) as boolean
  const jwtSecretKey = (await useStorage('redis').getItem('jwtKey')) as string

  const rawHeaders = event.node.req.rawHeaders
  let token: string

  // retrieve token from headers
  // console.log("rawHeaders: ", rawHeaders);
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
      if (logFlag)
        console.log(
          new Date(),
          'saasmvp OAUTH smvp-authorize.posts.ts: NO X-TOKEN in Request Header',
        )
      event.node.res.statusCode = 400
      return {
        message: 'saasmvp OAUTH smvp-authorize.posts.ts: NO X-TOKEN in Request Header',
        status: 400,
        data: {},
      }
    }
  }

  let decoded
  const now = Math.floor(Date.now() / 1000)
  try {
    decoded = jwt.verify(token, jwtSecretKey)
    if (logFlag)
      console.log(
        new Date(),
        'saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Authorized NOW:',
        now,
        'EXPIRES:',
        decoded.exp,
      )
  }
  catch (error) {
    // token expired
    if (logFlag)
      console.log(
        new Date(),
        'saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Expired',
      )

    event.node.res.statusCode = 400
    return {
      message: 'saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Expired',
      status: 400,
      data: {},
    }
  }

  // all good
  event.node.res.statusCode = 200
  return {
    message: 'saasmvp OAUTH smvp-authorize.posts.ts: AUTHORIZED',
    status: 200,
    data: {},
  }
})

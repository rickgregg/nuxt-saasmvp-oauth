// smvp-user-token.post.ts
// path is: /api/smvp/smvp-user-token
// @ts-expect-error: Could not find a declaration file for module jsonwebtoken
import jwt from 'jsonwebtoken'
import { defineEventHandler, readBody } from 'h3'
import { useStorage } from 'nitropack/runtime'

export default defineEventHandler(async (event) => {
  // read configuration data
  const logFlag = await useStorage('redis').getItem('logFlag') as boolean
  const jwtSecretKey = await useStorage('redis').getItem('jwtKey') as string
  const jwtKeyExpires = await useStorage('redis').getItem('jwtKeyExpires') as string
  const boundryTime = await useStorage('redis').getItem('boundryTime') as number

  // get request body
  const body = await readBody(event)

  // check timestamp
  const now = Math.floor(Date.now() / 1000)

  // add 100ms of tolerance to body.ts
  if (now > body.ts + boundryTime) {
    if (logFlag)
      console.log(
        new Date(),
        'saasmvp OAUTH smvp-user-token.post.ts timestamp out-of-bounds NOW:',
        now,
        'BOUNDRY:',
        body.ts + boundryTime,
      )

    event.node.res.statusCode = 400
    return {
      message: 'JWT User Token Not Generated',
      status: 400,
      data: {
        token: null,
      },
    }
  } // eo if

  // generate token
  const token = jwt.sign(body, jwtSecretKey, {
    expiresIn: Number.parseInt(jwtKeyExpires), // 3600 seconds = 1hr
  })
  if (logFlag)
    console.log(
      new Date(),
      'saasmvp OAUTH user-token.post.ts: JWT Token Generated NOW:',
      now,
    )

  event.node.res.statusCode = 200
  return {
    message: 'JWT User Token Generated',
    status: 200,
    data: {
      token: token,
    },
  }
})

// smvp-cors.ts
// https://www.reddit.com/r/Nuxt/comments/109au1x/how_so_enable_cors_in_nitro/

// https://github.com/nuxt/nuxt/issues/25571
import { defineNitroPlugin, useStorage } from 'nitropack/runtime'
import { getRequestURL, setResponseHeaders } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', async (event) => {
    const logFlag = (await useStorage('redis').getItem('logFlag')) as boolean
    if (logFlag) console.log(
      new Date(),
      'saasmvp OAUTH smvp-cors.ts server middleware ORIGIN:', getRequestURL(event).origin)

    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
    })

    if (event.method !== undefined && event.method === 'OPTIONS') {
      event.node.res.statusCode = 204
      event.node.res.statusMessage = 'No Content.'
      return 'OK'
    }
  })
})

// smvpServerInit.ts
import { readFile } from 'node:fs/promises'
import { accessSync, constants } from 'node:fs'
import { defineNitroPlugin, useStorage } from 'nitropack/runtime'

export default defineNitroPlugin(async () => {
  let initServer: boolean = true
  // get server configuration from smvp.config.json file
  const config = await smvpServerConfig()
  if (config === null) {
    console.log(new Date(), 'saasmvp OAUTH smvpServerInit.ts: smvp.config.json file NOT FOUND in ./server directory')
    initServer = false
  }
  else {
    // check required jwtKey data type
    if (!checkJWT(config.oauth.jwtKey)) {
      console.log(new Date(), 'saasmvp OAUTH smvpServerInit.ts: ERROR \'jwtKey\' needs to be EXACTLY 256 bits (32 bytes)')
      initServer = false
    }

    // check for required protected routes
    if (!checkProtected(config.protected)) {
      console.log(new Date(), 'saasmvp OAUTH smvpServerInit.ts: ERROR \'protected\' needs to be an array. If no routes are to be protected, provide an empty array []')
      initServer = false
    }

    if (initServer) {
      // store server configuration parameters for use by saasmvp module rest apis
      await useStorage('redis').setItem('protect', config.protected)
      await useStorage('redis').setItem('jwtKey', config.oauth.jwtKey)
      if (config.oauth.jwtKeyExpires !== undefined) {
        await useStorage('redis').setItem('jwtKeyExpires', config.oauth.jwtKeyExpires)
      }

      if (config.oauth.boundryTime !== undefined) {
        await useStorage('redis').setItem('boundryTime', config.oauth.boundryTime)
      }

      if (config.oauth.logFlag !== undefined) {
        await useStorage('redis').setItem('logFlag', config.oauth.logFlag)
      }

      if (config.oauth.logFlag) console.log(new Date(), 'saasmvp OAUTH smvpServerInit.ts: INITIALIZED')
    }
    else {
      if (config.oauth.logFlag) console.log(new Date(), 'saasmvp OAUTH smvpServerInit.ts: *** NOT *** INITIALIZED')
    }
  }
})

const smvpServerConfig = async () => {
  let configPath: string | null = null
  const currentDir = process.cwd()

  try {
    // primary location for smvp.oauth.json
    const path = currentDir + '/server/smvp.oauth.json'
    accessSync(path, constants.F_OK)
    configPath = path
  }
  catch (e) {
    configPath = null
    try {
      // alternate location for smvp.oauth.json
      const path = currentDir + '/playground/server/smvp.oauth.json'
      accessSync(path, constants.F_OK)
      configPath = path
    }
    catch (e) {
      configPath = null
    }
  }
  /* eslint no-unsafe-finally: 0 */
  finally {
    if (configPath === null) {
      return null
    }
    return await getConfig(configPath)
  }
}

const getConfig = async (path: string) => {
  interface Options {
    oauth: {
      jwtKey: string // required
      jwtKeyExpires?: string // optional
      boundryTime?: number // optional
      logFlag?: boolean // optional
    }
    protected: string [] // required
  }

  const options: Options = { oauth: { jwtKey: '', jwtKeyExpires: '', boundryTime: 0, logFlag: false }, protected: [] }

  const buffer = await readFile(path)
  // set default options if undefined
  const buf = JSON.parse(buffer.toString())
  buf.oauth.jwtKey === undefined ? (options.oauth.jwtKey = '') : (options.oauth.jwtKey = buf.oauth.jwtKey)
  buf.oauth.jwtKeyExpires === undefined ? (options.oauth.jwtKeyExpires = '3600') : (options.oauth.jwtKeyExpires = buf.oauth.jwtKeyExpires)
  buf.oauth.boundryTime === undefined ? (options.oauth.boundryTime = 100) : (options.oauth.boundryTime = buf.oauth.boundryTime)
  buf.oauth.logFlag === undefined ? (options.oauth.logFlag = false) : (options.oauth.logFlag = buf.oauth.logFlag)
  buf.protected === undefined ? (options.protected = []) : (options.protected = buf.protected)
  return options
}

const checkJWT = (s: unknown): boolean => {
  if (typeof s === 'string' && s.length != 32) {
    return false
  }
  return true
}

const checkProtected = (x: string[]): boolean => {
  if (Array.isArray(x)) {
    return true
  }
  return false
}

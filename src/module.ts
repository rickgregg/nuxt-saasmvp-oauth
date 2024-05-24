// module.ts
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
  addServerPlugin,
  addServerImportsDir,
} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Usually the npm package name of your module
    name: 'nuxt-saasmvp-oauth',
    // The key in `nuxt.config` that holds your module options
    configKey: 'saasmvpOauth',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },

  // Default configuration options for your module, can also be a function returning those
  defaults: {},

  // hooks go here
  hooks: {},

  // The function holding your module logic, it can be asynchronous
  setup() {
    const resolver = createResolver(import.meta.url)

    // client library
    addImportsDir(resolver.resolve('./runtime/lib'))

    // server library
    addServerImportsDir(resolver.resolve('./runtime/server/utils'))

    // client middleware
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/middleware/smvp-pageauth'))

    // server apis
    // https://github.com/nuxt/nuxt/issues/18909
    addServerHandler({
      route: '/api/smvp/smvp-user-token',
      handler: resolver.resolve('./runtime/server/api/smvp/smvp-user-token.post'),
    })

    addServerHandler({
      route: '/api/smvp/smvp-authorize',
      handler: resolver.resolve('./runtime/server/api/smvp/smvp-authorize.post'),
    })

    addServerHandler({
      route: '/api/smvp/smvp-api-token',
      handler: resolver.resolve('./runtime/server/api/smvp/smvp-api-token.post'),
    })

    // server middleware
    // https://github.com/nuxt/nuxt/issues/18556
    addServerPlugin(
      resolver.resolve('./runtime/server/middleware/smvp-cors'),
    )

    addServerPlugin(
      resolver.resolve('./runtime/server/middleware/smvp-apiauth'),
    )

    // initialize server
    addServerPlugin(
      resolver.resolve('./runtime/plugins/smvpServerInit'),
    )
  },
})

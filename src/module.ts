//module.ts
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addServerHandler,
  addServerPlugin,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Usually the npm package name of your module
    name: "nuxt-saasmvp-oauth",
    // The key in `nuxt.config` that holds your module options
    configKey: "myModule",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },

  // Default configuration options for your module, can also be a function returning those
  defaults: {},

  // The function holding your module logic, it can be asynchronous
  setup(options, nuxt) {
    
    const resolver = createResolver(import.meta.url);

    // client library
    addImportsDir(resolver.resolve("./runtime/lib"));

    // client middleware
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/middleware/smvp-pageauth"));

    // server apis
    addServerHandler({
      route: "/api/smvp/smvp-user-token",
      handler: resolver.resolve("./runtime/server/api/smvp/smvp-user-token.post.ts"),
    });

    addServerHandler({
      route: "/api/smvp/smvp-authorize",
      handler: resolver.resolve("./runtime/server/api/smvp/smvp-authorize.post.ts"),
    });

    addServerHandler({
      route: "/api/smvp/smvp-api-token",
      handler: resolver.resolve("./runtime/server/api/smvp/smvp-api-token.post.ts"),
    });

    addServerHandler({
      route: "/api/smvp/smvp-init-auth",
      handler: resolver.resolve("./runtime/server/api/smvp/smvp-init-auth.post.ts"),
    });

    //server middleware
    addServerPlugin(
      resolver.resolve("./runtime/server/middleware/smvp-apiauth")
    );
  },
});

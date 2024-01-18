//smvp-apiauth.ts server middleware
//NOTE: API SERVER ENDPOINT AUTHENTICATION (SEE smvp-pageauth.ts FOR PAGE AUTHENTICATION)

//@ts-ignore
import jwt from "jsonwebtoken";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("request", async (event) => {
    //read configuration data
    const logFlag = (await useStorage("redis").getItem("logFlag")) as boolean;
    const protect = (await useStorage("redis").getItem("protect")) as string[];
    const jwtSecretKey = (await useStorage("redis").getItem(
      "jwtKey"
    )) as string;

    //get route and headers from request
    const route = event.node.req.url as string;
    const rawHeaders = event.node.req.rawHeaders;

    //authenticate protected route
    if (isProtectedRoute(protect, route, logFlag)) {
      let token:string | null = null;
      
      //retrieve token from headers
      //SEE: https://github.com/nuxt/nuxt/discussions/24220#discussioncomment-7527473
      if (rawHeaders.includes("X-TOKEN")) {
        token = rawHeaders[rawHeaders.indexOf("X-TOKEN") + 1];
      } else {
        if (rawHeaders.includes("x-token")) {
          token = rawHeaders[rawHeaders.indexOf("x-token") + 1];
        } else {
          //error - no jwt token in headers
          if(logFlag) console.log(
            new Date(),
            "saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authentication ERROR: NO X-TOKEN in Request Header"); 
            await useStorage('redis').setItem('error401', true)  
        }
      }

      //validate token
      let decoded;
      const now = Math.floor(Date.now() / 1000);
      try {
        decoded = jwt.verify(token, jwtSecretKey);
        if (logFlag)
          console.log(
            new Date(),
            "saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authenticated NOW:",
            now,
            "EXPIRES:",
            decoded.exp
          );
      } catch (error) {
        //error - token malformed or expired
        if(logFlag) console.log(
          new Date(),
          "saasmvp OAUTH smvp-apiauth.ts server middleware: API Endpoint Authentication ERROR: TOKEN MALFORMED OR EXPIRED");
        await useStorage('redis').setItem('error401', true)    
      }   
    }//eo if (isProtectedRoute(protect, route, logFlag))

    //modify application response body if error detected in http request
    //RUNS ASYNCHRONOUSLY FROM nitroApp.hooks.hook("request", async (event)
    nitroApp.hooks.hook("beforeResponse", async (event, { body }) => {
      //@ts-ignore
      if((body.response.status !== undefined) && (await useStorage('redis').getItem('error401'))){
        //rewrite application response body with '401 Unauthorized' error
        //@ts-ignore
        body.response = {message: "Unauthorized", status: 401};
        await useStorage('redis').setItem('error401', false) 
      }
    }); 

  });
  //
  //okay to keep going
  //
});

const isProtectedRoute = (
  protect: string[],
  route: string,
  logFlag: boolean
) => {
  //check for empty protect array
  if (protect.length == 0 && logFlag) {
    console.log(
      new Date(),
      "saasmvp OAUTH smvp-apiauth.ts server middleware: NO ROUTES TO PROTECT"
    );
    return false;
  }

  let strictFlag: boolean = false;
  let varFlag: boolean = false;

  protect.forEach((protect) => {
    const regexVariableRoute = new RegExp(
      "/api/v([1-9]|[1-9][0-9])/.+/[*]",
      "g"
    );
    if (regexVariableRoute.test(protect)) {
      //check for variable route
      varFlag = route.includes(protect.slice(0, -2));
    }

    const regexStrictRoute = new RegExp(
      "^/api/v([1-9]|[1-9][0-9])/.+[a-z]$",
      "g"
    );
    if (regexStrictRoute.test(protect)) {
      //check for strict route
      if (protect == route) {
        strictFlag = true;
      }
    }
  });

  if (varFlag || strictFlag) {
    //protected route
    if (logFlag)
      console.log(
        new Date(),
        "saasmvp OAUTH smvp-apiauth.ts server middleware: ROUTE:",
        route,
        "*** PROTECTED ***"
      );
    return true;
  } else {
    //un-protected route
    if (logFlag)
      console.log(
        new Date(),
        "saasmvp OAUTH smvp-apiauth.ts server middleware: ROUTE:",
        route,
        "*** UNPROTECTED ***"
      );
    return false;
  }
};

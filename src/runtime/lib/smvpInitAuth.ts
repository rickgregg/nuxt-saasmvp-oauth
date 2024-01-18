//smvpInitAuth.ts
/*eslint no-self-assign: 0*/
import { useInit } from "../composables/useInit";
import { useLog } from "../composables/useLog";
import { useRoute } from "../composables/useRoute";

interface Options {
  jwtKey: string; //required
  jwtKeyExpires?: string; //optional
  boundryTime?: number; //optional
  logFlag?: boolean; //optional
  redirectRoute?: string; //optional
}

//typescript branded type to enforce key length
type JWTKey = string & { __brand: "JWTKey" };
function assertJWTKey(s: unknown): asserts s is JWTKey {
  if (typeof s === "string" && s.length != 32) {
    throw new Error("jwtKey needs to be EXACTLY 256 bits (32 bytes)");
  }
}

export const smvpInitAuth = async (
  routes: object | string[],
  options: Options
): Promise<boolean> => {
  //check jwtKey data type
  assertJWTKey(options.jwtKey);
  //set defaults if needed, logFlag = false, keyExpires = "3600" (1 hour), boundryTime = 100 (100ms), redirectRoute = '/' (Home Page)
    options.logFlag === undefined
    ? (options.logFlag = false)
    : (options.logFlag = options.logFlag);
  options.jwtKeyExpires === undefined
    ? (options.jwtKeyExpires = "3600")
    : (options.jwtKeyExpires = options.jwtKeyExpires);
  options.boundryTime === undefined
    ? (options.boundryTime = 100)
    : (options.boundryTime = options.boundryTime)
  options.redirectRoute === undefined
    ? (options.redirectRoute = '/')
    : (options.redirectRoute = options.redirectRoute)

  //initialize client state
  useLog.setLogFlag(options.logFlag)
  useRoute.setRoute(options.redirectRoute)

  //initialize server state
  const body = Object.assign(
    {},
    {
      protected: routes,
      jwtKey: options.jwtKey,
      jwtKeyExpires: options.jwtKeyExpires,
      boundryTime: options.boundryTime,
      logFlag: options.logFlag,
    }
  );

  try {
    //wait for the `fetch()` call to be settled
    const response = await fetch("/api/smvp/smvp-init-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    //wait for the `response.json()` call to be settled
    const json = await response.json();
  } catch (error) {
    console.log(error);
  }

  useInit.setInit(true);
  return true;
};

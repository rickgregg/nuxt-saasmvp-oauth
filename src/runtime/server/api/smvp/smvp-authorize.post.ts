//authorize.post.ts
//@ts-ignore
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  //read configuration data
  const logFlag = (await useStorage("redis").getItem("logFlag")) as boolean;
  const jwtSecretKey = (await useStorage("redis").getItem("jwtKey")) as string;

  const rawHeaders = event.node.req.rawHeaders;
  let token: string;

  //retrieve token from headers
  //console.log("rawHeaders: ", rawHeaders);
  //SEE: https://github.com/nuxt/nuxt/discussions/24220#discussioncomment-7527473
  if (rawHeaders.includes("X-TOKEN")) {
    token = rawHeaders[rawHeaders.indexOf("X-TOKEN") + 1];
  } else {
    if (rawHeaders.includes("x-token")) {
      token = rawHeaders[rawHeaders.indexOf("x-token") + 1];
    } else {
      //error - no jwt token in headers
      if (logFlag) 
        console.log(
          new Date(),
          "saasmvp OAUTH smvp-authorize.posts.ts: NO X-TOKEN in Request Header"
        );
      throw createError({
        statusCode: 400,
        statusMessage:
          "saasmvp OAUTH smvp-authorize.posts.ts: NO X-TOKEN in Request Header",
      });
    }
  }

  let decoded;
  const now = Math.floor(Date.now() / 1000);
  try {
    decoded = jwt.verify(token, jwtSecretKey);
    if (logFlag)
      console.log(
        new Date(),
        "saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Authorized NOW:",
        now,
        "EXPIRES:",
        decoded.exp
      );
  } catch (error) {
    //token expired
    if (logFlag)
      console.log(
        new Date(),
        "saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Expired"
      );
    return {
      response: {
        message: "saasmvp OAUTH smvp-authorize.posts.ts: JWT Token Expired",
        status: 400,
      },
    };
  }

  //all good
  return {
    response: {
      message: "saasmvp OAUTH smvp-authorize.posts.ts: AUTHORIZED",
      status: 200,
    },
  };
});

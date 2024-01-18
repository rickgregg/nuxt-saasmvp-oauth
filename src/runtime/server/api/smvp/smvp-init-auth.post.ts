//init-auth.ts
export default defineEventHandler(async (event) => {
  //get request body
  const body = await readBody(event);

  //store server configuration parameters for use by rest apis
  await useStorage('redis').setItem('protect', body.protected)
  await useStorage('redis').setItem('jwtKey', body.jwtKey)
  await useStorage('redis').setItem('jwtKeyExpires', body.jwtKeyExpires)
  await useStorage('redis').setItem('boundryTime', body.boundryTime)
  await useStorage('redis').setItem('logFlag', body.logFlag)
  //internal flag used by smvp-apiauth.ts server middleware
  await useStorage('redis').setItem('error401', false)
  
  if(body.logFlag) console.log(new Date(), "saasmvp OAUTH init-auth.posts.ts: INITIALIZED")

  return {
    response: { message: "saasmvp OAUTH init-auth.posts.ts: INITIALIZED", status: 200 },
  };
})
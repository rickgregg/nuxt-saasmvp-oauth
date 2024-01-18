//smvp-api-token.post.ts
//@ts-ignore
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  //read configuration data
  const logFlag = await useStorage('redis').getItem('logFlag') as boolean;
  const jwtSecretKey = await useStorage('redis').getItem('jwtKey') as string;
  const boundryTime = await useStorage('redis').getItem('boundryTime') as number;
  
  //get request body
  const body = await readBody(event);

  //check timestamp
  const now = Math.floor(Date.now() / 1000);

  //boundryTime tolerance to body.ts
  if (now > body.ts + boundryTime) {
    if (logFlag)
      console.log(
        new Date(),
        "saasmvp OAUTH smvp-api-token.post.ts timestamp out-of-bounds NOW:",
        now,
        "BOUNDRY:",
        body.ts + boundryTime
      );
    return {
      response: { token: null, status: 400 },
    };
  } //eo if

  //generate token
  const token = jwt.sign(body, jwtSecretKey, {
    expiresIn: "10 years",
  });

  return {
    response: { token: token, status: 200 },
  };
});

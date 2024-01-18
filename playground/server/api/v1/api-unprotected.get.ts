//api-unprotected.get.ts
//path is /api/v1/api-unprotected
export default defineEventHandler((event) => {
  //add the route /api/v1/api-unprotected to the protected.json file and observe the results
  return {
    response: { route: "unprotected", method: "GET", status: 200 },
  };
})
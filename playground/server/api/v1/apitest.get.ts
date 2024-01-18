//apitest.get.ts
//path is /api/v1/apitest
export default defineEventHandler((event) => {
  //add GET functionality
  return {
    response: { route: "protected", method: "GET", status: 200 },
  };
})
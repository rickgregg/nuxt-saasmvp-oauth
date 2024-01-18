//apitest.patch.ts
//path is /api/v1/apitest
export default defineEventHandler((event) => {
  //add PATCH functionality
  return {
    response: { route: "protected", method: "PATCH", status: 200 },
  };
})

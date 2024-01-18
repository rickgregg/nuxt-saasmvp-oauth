//apitest.put.ts
// path is /api/v1/apitest
export default defineEventHandler((event) => {
  //add PUT functionality
  return {
    response: { route: "protected", method: "PUT", status: 200 },
  };
})

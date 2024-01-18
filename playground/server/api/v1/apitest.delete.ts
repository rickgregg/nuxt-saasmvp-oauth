//apitest.delete.ts
//path is /api/v1/apitest
export default defineEventHandler((event) => {
  //add DELETE functionality
  return {
    response: { route: "protected", method: "DELETE", status: 200 },
  };
})

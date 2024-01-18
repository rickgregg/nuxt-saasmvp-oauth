//apitest.post.ts
//path is /api/v1/apitest
export default defineEventHandler((event) => {
  //add POST functionality
  return {
    response: { route: "protected", method: "POST", status: 200 },
  };
})

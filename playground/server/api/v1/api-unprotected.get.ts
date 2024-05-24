// api-unprotected.get.ts
// path is /api/v1/api-unprotected
export default defineEventHandler((event) => {
  // add functionality here
  event.node.res.statusCode = 200
  return {
    message: 'Unprotected',
    status: 200,
    data: { },
  }
})

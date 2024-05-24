// api/v1/nested/[name]/nested.get.ts
// path is api/v1/nested/[name]/nested
export default defineEventHandler((event) => {
  if (!smvpIsRestAuth()) {
    event.node.res.statusCode = 401
    return {
      message: 'Unauthorized',
      status: 401,
      data: {},
    }
  }
  const name = getRouterParam(event, 'name')
  const result = `Hello, ${name} /nested`
  //
  // add functionality here
  //
  event.node.res.statusCode = 200
  return {
    message: 'Protected',
    status: 200,
    data: { result },
  }
})

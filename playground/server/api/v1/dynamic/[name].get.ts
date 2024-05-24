// dynamic/[name].get.ts
// path is api/v1/dynamic/[name].get.ts
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
  const result = `Hello, ${name}`
  //
  // add funtionality here
  //
  event.node.res.statusCode = 200
  return {
    message: 'Protected',
    status: 200,
    data: { result },
  }
})

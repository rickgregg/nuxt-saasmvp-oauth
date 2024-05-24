// query.get.ts
// path is api/v1/query?lastName=name&age=age
export default defineEventHandler((event) => {
  if (!smvpIsRestAuth()) {
    event.node.res.statusCode = 401
    return {
      message: 'Unauthorized',
      status: 401,
      data: {},
    }
  }
  const result = getQuery(event)
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

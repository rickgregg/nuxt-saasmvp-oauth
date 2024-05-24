// apitest.get.ts
// path is /api/v1/apitest
export default defineEventHandler((event) => {
  if (!smvpIsRestAuth()) {
    event.node.res.statusCode = 401
    return {
      message: 'Unauthorized',
      status: 401,
      data: {},
    }
  }
  //
  // add GET functionality
  //
  event.node.res.statusCode = 200
  return {
    message: 'Protected',
    status: 200,
    data: { endpoint: '/api/v1/apitest', method: 'GET' },
  }
})

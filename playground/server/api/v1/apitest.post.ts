// apitest.post.ts
// path is /api/v1/apitest
export default defineEventHandler(async (event) => {
  if (!smvpIsRestAuth()) {
    event.node.res.statusCode = 401
    return {
      message: 'Unauthorized',
      status: 401,
      data: {},
    }
  }
  const body = await readBody(event)
  console.log(body)
  //
  // add POST functionality
  //
  event.node.res.statusCode = 200
  return {
    message: 'Protected',
    status: 200,
    data: { body },
  }
})

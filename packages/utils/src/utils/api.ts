export const responseHandler = ({ data, query = '', error, cache = false, status = null }: any) => {
  if (error) {
    return {
      system: { cache, error: true, status: status || 500, query },
      response: {
        error
      }
    }
  }

  return {
    system: { cache, error: false, status: status || 200, query },
    response: {
      data
    }
  }
}

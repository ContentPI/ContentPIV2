const cookies = {
  get(cookie: string, cookiesStr: string | null) {
    if (!cookiesStr) {
      return null
    }

    const cookiesObj = cookiesStr.split('; ').reduce((prev: any, current: string) => {
      const [name, ...value] = current.split('=')
      prev[name] = value.join('=')
      return prev
    }, {})

    return cookiesObj[cookie] ?? null
  }
}

export default cookies

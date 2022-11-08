const ts = {
  hasKey<O>(obj: O, key: keyof any): key is keyof O {
    return key in obj
  },
  includes(Type: any, value: any) {
    return Object.values(Type).includes(value)
  }
}

export default ts

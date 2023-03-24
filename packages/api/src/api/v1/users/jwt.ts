import { security, base64 } from '@contentpi/utils'
import jwt from 'jsonwebtoken'

export const secretKey = 'ContentPI'
export const expiresIn = '30d'

export const createToken = async ({
  id,
  username,
  password,
  email,
  active,
  role
}: any): Promise<string[] | string> => {
  const token = base64.set(`${security.encrypt(secretKey)}${password}`)
  const userData = {
    id,
    username,
    email,
    active,
    token,
    role
  }

  const createTk = jwt.sign({ data: base64.set(userData) }, secretKey, {
    expiresIn
  })

  return Promise.all([createTk])
}

export function jwtVerify(accessToken: string, cb: any): any {
  jwt.verify(accessToken, secretKey, (error: any, accessTokenData: any = {}) => {
    const { data: user } = accessTokenData

    if (error || !user) {
      return cb(false)
    }

    const userData = base64.get(user)

    return cb(userData)
  })

  return null
}

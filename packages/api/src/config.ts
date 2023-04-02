import dotenv from 'dotenv'

import { Configuration } from './types/config'

// Loading Env vars
dotenv.config()

export const customConfig: Configuration = {
  domainName: 'contentpi.com',
  port: 4000,
  mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production',
  api: {
    baseUrl:
      process.env.NODE_ENV !== 'production' ? 'http://localhost:4000' : 'https://contentpi.com',
    version: 'v1'
  }
}

const buildConfig = (): Configuration => {
  const config: Configuration = {
    ...customConfig,
    database: {
      debug: customConfig.mode === 'development',
      engine: process.env.DB_ENGINE as string,
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT) as number,
      database: process.env.DB_DATABASE as string,
      username: process.env.DB_USERNAME as string,
      password: process.env.DB_PASSWORD as string
    },
    jwt: {
      secretKey: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  }

  return config
}

const Config = buildConfig()

export default Config

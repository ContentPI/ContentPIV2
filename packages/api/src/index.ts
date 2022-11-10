import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { applyMiddleware } from 'graphql-middleware'

import modelsApi from './api/v1/models'
import usersApi from './api/v1/users'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/types'

const app = express()
const port = 4000

const corsOptions = {
  origin: '*',
  credentials: true
}

app.use(cors(corsOptions))

app.use(cookieParser())

app.use(bodyParser.json())

// Schema
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  })
)

// API
app.use('/api/v1/models', modelsApi)
app.use('/api/v1/users', usersApi)

// Apollo Server
const apolloServer = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const apiUrl = 'http://localhost:4000'
    const apiVersions: Record<string, string> = {
      v1: '/api/v1'
    }
    const version = req.headers['api-version'] || 'v1'
    const apiVersion: string = apiVersions[version as string] || apiVersions.v1

    return {
      request: (endpoint: string, options = {}) => {
        const requestOptions: any = {
          ...options,
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json'
          }
        }

        return fetch(`${apiUrl}${apiVersion}${endpoint}`, requestOptions).then((res) => res.json())
      }
    }
  }
})

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions })

  app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log('Running on http://localhost:4000')
  })
})

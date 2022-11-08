import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { applyMiddleware } from 'graphql-middleware'

import userApi from './api/user'
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
app.use('/api/user', userApi)

// Apollo Server
const apolloServer = new ApolloServer({
  schema,
  context: async () => ({
    request: (endpoint: string, options = {}) => {
      const requestOptions: any = {
        ...options,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      return fetch(`http://localhost:4000${endpoint}`, requestOptions).then((res) => res.json())
    }
  })
})

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app, path: '/graphql', cors: corsOptions })

  app.listen({ port }, () => {
    // eslint-disable-next-line no-console
    console.log('Running on http://localhost:4000')
  })
})

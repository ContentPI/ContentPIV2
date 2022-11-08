import express, { Request, Response } from 'express'
import knexConfig from '../../db/knexfile'

type findAllParams = {
  table: string
  fields: any
  where?: any
  orWhere?: any
}

const responseHandler = ({ data, operation = '', error, cache = false, status = null }: any) => {
  if (error) {
    return {
      system: { cache, error: true, status: status || 500, operation },
      response: {
        error
      }
    }
  }

  return {
    system: { cache, error: false, status: status || 200, operation },
    response: {
      data
    }
  }
}

const orm: any = (db: any) => ({
  async findAll({ table, fields, where = null, orWhere = null }: findAllParams) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!fields) {
      throw new Error('Fields are required')
    }

    let result = null

    if (where) {
      result = await db(table).select(fields).where(where)
    }

    if (where && orWhere) {
      result = await db(table).select(fields).where(where).orWhere(orWhere)
    }

    if (!where) {
      result = await db(table).select(fields)
    }

    return result.length > 0 ? result : null
  }
})

const knex = require('knex')(knexConfig.development)

const router = express.Router()

const get = {
  users: async (req: Request, res: Response) => {
    try {
      const { data, sql } = await orm(knex).findAll({
        table: 'users',
        fields: {
          id: 'id',
          username: 'username',
          email: 'email',
          role: 'role',
          active: 'active'
        }
      })

      if (data.length > 0) {
        res.json(responseHandler({ data, operation: 'SELECT * FROM users' }))
      }
    } catch (error) {
      res.json(responseHandler({ error, operation: 'GET_ALL_USERS' }))
    }
  }
}

router.get('/all', get.users)

const post = {
  create: async (req: Request, res: Response) => {
    try {
      const { username = '', password = '', email = '', role = '', active = false } = req.body

      if (username === '' || password === '' || email === '' || role === '') {
        res.json(
          responseHandler({
            error: {
              code: 'MISSING_FIELDS',
              message:
                'Username, password, email and role are required. Please fill out all required fields.'
            },
            status: 400,
            operation: 'createUser'
          })
        )
      }

      const userData = await orm(knex).findAll({
        table: 'users',
        fields: {
          id: 'id'
        },
        where: {
          username
        },
        orWhere: {
          email
        }
      })

      if (userData) {
        res.json(
          responseHandler({
            error: {
              code: 'USERNAME_OR_EMAIL_EXISTS',
              message:
                'Username or email already exists. Please try again with a different username or email.'
            },
            status: 400,
            operation: 'createUser'
          })
        )
        res.json({
          system: { cache: false, error: true, status: 400 },
          response: {
            error: {
              details: '',
              message: ''
            }
          }
        })
      }

      const user = await knex('users').insert({
        username,
        password,
        email,
        role,
        active
      })

      res.json({
        system: { cache: false, error: false, status: 200 },
        response: {
          data: user
        }
      })
    } catch (error) {
      res.json({
        system: { cache: false, error: true, status: 500 },
        response: {
          error: {
            details: error,
            message: 'An error occurred, please try again later.'
          }
        }
      })
    }
  }
}

router.post('/create', post.create)

export default router

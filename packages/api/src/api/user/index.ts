import express, { Request, Response } from 'express'

import knexConfig from '../../db/knexfile'

const db = require('knex')(knexConfig.development)

const router = express.Router()

const responseHandler = ({ data, query = '', error, cache = false, status = null }: any) => {
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

const orm: any = (driver: any) => ({
  async findAll({ table, fields, where = null, orWhere = null }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!fields) {
      throw new Error('Fields are required')
    }

    let result = null

    if (where) {
      result = await driver(table).select(fields).where(where)
    }

    if (where && orWhere) {
      result = await driver(table).select(fields).where(where).orWhere(orWhere)
    }

    if (!where) {
      result = await driver(table).select(fields)
    }

    return result.length > 0 ? result : null
  },
  async insert({ table, data }: any) {
    if (!table) {
      throw new Error('Table name is required')
    }

    if (!data) {
      throw new Error('Data is required')
    }

    const result = await driver(table).insert(data)

    return result
  }
})

const get = {
  users: async (req: Request, res: Response) => {
    const query = 'SELECT id, username, email, role, active FROM users'

    try {
      const usersData = await orm(db).findAll({
        table: 'users',
        fields: {
          id: 'id',
          username: 'username',
          email: 'email',
          role: 'role',
          active: 'active'
        }
      })

      if (usersData) {
        res.json(
          responseHandler({
            data: usersData,
            query
          })
        )
      }
    } catch (error) {
      res.json(responseHandler({ error, query }))
    }
  }
}

router.get('/all', get.users)

const post = {
  createUser: async (req: Request, res: Response) => {
    const { username = '', password = '', email = '', role = '', active = false } = req.body
    const query = `INSERT INTO users (username, password, email, role, active) VALUES (${username}, ?, ${password}, ${email}, ${role}, ${active})`

    try {
      if (username === '' || password === '' || email === '' || role === '') {
        res.json(
          responseHandler({
            error: {
              code: 'MISSING_FIELDS',
              message:
                'Username, password, email and role are required. Please fill out all required fields.'
            },
            status: 400,
            query
          })
        )
      }

      const userData = await orm(db).findAll({
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
            query: `SELECT id FROM users WHERE username = ${username} OR email = ${email}`
          })
        )
      }

      const insertedUser = await orm(db).insert({
        table: 'users',
        data: {
          username,
          password,
          email,
          role,
          active
        }
      })

      res.json(
        responseHandler({
          data: insertedUser,
          query
        })
      )
    } catch (error) {
      res.json(
        responseHandler({
          error: {
            code: 'SERVER_ERROR',
            message: 'An error occurred, please try again later.'
          },
          query
        })
      )
    }
  }
}

router.post('/create', post.createUser)

export default router

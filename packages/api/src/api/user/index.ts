import { orm, responseHandler, security } from '@contentpi/utils'
import express, { Request, Response } from 'express'

import knexConfig from '../../db/knexfile'

const db = require('knex')(knexConfig.development)

const router = express.Router()

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
    const query = `INSERT INTO users (username, password, email, role, active) VALUES (${username}, ?, ${email}, ${role}, ${active})`

    try {
      if (username === '' || password === '' || email === '' || role === '') {
        return res.json(
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
        return res.json(
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

      const userToInsert = {
        username,
        password: security.encrypt(password),
        email,
        role,
        active
      }

      await orm(db).insert({
        table: 'users',
        data: userToInsert
      })

      const newUserData = await orm(db).findAll({
        table: 'users',
        fields: {
          id: 'id',
          username: 'username',
          email: 'email',
          role: 'role',
          active: 'active'
        },
        where: {
          email
        }
      })

      return res.json(
        responseHandler({
          data: newUserData[0],
          query
        })
      )
    } catch (error) {
      return res.json(
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

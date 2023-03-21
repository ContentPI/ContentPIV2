import { responseHandler, security } from '@contentpi/utils'
import { db } from '../../../db/knex'

type User = {
  username: string
  password?: string
  email: string
  role: string
  active: boolean
}

export const getUsers = async () => {
  const query = 'SELECT id, username, email, role, active FROM users'

  try {
    const usersData = await db('users').select({
      id: 'id',
      username: 'username',
      email: 'email',
      role: 'role',
      active: 'active'
    })

    if (usersData) {
      return responseHandler({
        data: usersData,
        query
      })
    }
  } catch (error) {
    return responseHandler({ error, query })
  }

  return null
}

export const createUser = async ({
  username = '',
  password = '',
  email = '',
  role = '',
  active = false
}: User) => {
  const encryptedPassword = security.encrypt(password)
  const query = `INSERT INTO users (username, password, email, role, active) VALUES ('${username}', '${encryptedPassword}', '${email}', '${role}', ${active})`

  try {
    if (username === '' || password === '' || email === '' || role === '') {
      return responseHandler({
        error: {
          code: 'MISSING_FIELDS',
          message:
            'Username, password, email and role are required. Please fill out all required fields.'
        },
        status: 400,
        query
      })
    }

    const userData = await db('users').select({ id: 'id' }).where({ username }).orWhere({ email })

    if (userData) {
      return responseHandler({
        error: {
          code: 'USERNAME_OR_EMAIL_EXISTS',
          message:
            'Username or email already exists. Please try again with a different username or email.'
        },
        status: 400,
        query: `SELECT id FROM users WHERE username = ${username} OR email = ${email}`
      })
    }

    const userToInsert = {
      username,
      password: encryptedPassword,
      email,
      role,
      active
    }

    await db('users').insert(userToInsert)

    const newUserData = await db('users')
      .select({
        id: 'id',
        username: 'username',
        email: 'email',
        role: 'role',
        active: 'active'
      })
      .where({ email })

    return responseHandler({
      data: newUserData[0],
      query
    })
  } catch (error) {
    return responseHandler({
      error: {
        code: 'SERVER_ERROR',
        message: 'An error occurred, please try again later.'
      },
      query
    })
  }
}

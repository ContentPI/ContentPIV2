import { responseHandler, security, is } from '@contentpi/utils'
import { createToken, jwtVerify } from './jwt'
import { db } from '../../../db/knex'

export const secretKey = 'ContentPI'
export const expiresIn = '30d'

type User = {
  username: string
  password?: string
  email: string
  role: string
  active: boolean
}

type Login = {
  emailOrUsername: string
  password: string
}

// Private methods
export const getUserData = async (accessToken: any): Promise<any> => {
  const UserPromise = new Promise((resolve) => jwtVerify(accessToken, (user: any) => resolve(user)))

  const user = await UserPromise

  return user
}

export const getUserBy = async (where: any, roles: string[]): Promise<any> => {
  const [user] = await db('users')
    .select({
      id: 'id',
      username: 'username',
      password: 'password',
      email: 'email',
      role: 'role',
      active: 'active'
    })
    .where(where)

  if (user && roles.includes(user.role)) {
    return user
  }

  return null
}

export const authenticate = async (emailOrUsername: string, password: string): Promise<any> => {
  const where = is.Email(emailOrUsername)
    ? { email: emailOrUsername }
    : { username: emailOrUsername }

  const query = `SELECT * FROM users WHERE ${
    is.Email(emailOrUsername) ? 'email' : 'username'
  } = ? AND password = ?`

  const user = await getUserBy(where, ['god', 'admin', 'editor', 'user'])

  if (!user) {
    return responseHandler({
      error: {
        code: 'INVALID_LOGIN',
        message: 'Invalid Login'
      },
      status: 403,
      query
    })
  }

  const passwordMatch = is.PasswordMatch(security.encrypt(password), user.password)
  const isActive = user.active

  if (!passwordMatch) {
    return responseHandler({
      error: {
        code: 'INVALID_LOGIN',
        message: 'Invalid Login'
      },
      status: 403,
      query
    })
  }

  if (!isActive) {
    return responseHandler({
      error: {
        code: 'ACCOUNT_NOT_ACTIVATED',
        message: 'Your account is not activated yet'
      },
      status: 403,
      query
    })
  }

  const [token] = await createToken(user)

  return responseHandler({
    data: {
      token
    },
    query
  })
}

// Public methods
export const getUser = async (at: string) => {
  const query = 'SELECT * FROM users WHERE emailOrUsername = ? AND password = ?'
  const connectedUser = await getUserData(at)

  if (connectedUser) {
    // Validating if the user is still valid
    const user = await getUserBy(
      {
        id: connectedUser.id,
        email: connectedUser.email,
        active: connectedUser.active
      },
      [connectedUser.role]
    )

    if (user) {
      return responseHandler({
        data: connectedUser,
        query
      })
    }
  }

  return responseHandler({
    data: {
      id: '',
      username: '',
      email: '',
      role: '',
      active: false,
      _DEBUG: JSON.stringify({
        hasCookie: Boolean(at)
      })
    },
    query
  })
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

  // Check if required fields are filled out
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

    // Check if username or email already exists
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

    // Create new user
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

export const login = async ({ emailOrUsername = '', password = '' }: Login) =>
  authenticate(emailOrUsername, password)

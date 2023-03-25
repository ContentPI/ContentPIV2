const userData = {
  username: 'user',
  password: '12345678',
  email: 'foo@bar.com',
  role: 'god',
  active: false
}

export const user = {
  withoutUsername: {
    ...userData,
    username: ''
  },
  withoutPassword: {
    ...userData,
    password: ''
  },
  withoutEmail: {
    ...userData,
    email: ''
  },
  withoutRole: {
    ...userData,
    role: ''
  },
  existingUser: {
    ...userData
  },
  newUser: {
    ...userData
  }
}

export const query = {
  getUsers:
    'select "id" as "id", "username" as "username", "email" as "email", "role" as "role", "active" as "active" from "users"',
  createUser: {
    existingUser: 'select "id" as "id" from "users" where "username" = ? or ("email" = ?)',
    insertedUser:
      'select "id" as "id", "username" as "username", "email" as "email", "role" as "role", "active" as "active" from "users" where "email" = ?'
  }
}

export const mockResponse = {
  getUser: {
    error: {
      userWithoutData: (at: string) => ({
        id: '',
        username: '',
        email: '',
        role: '',
        active: false,
        _DEBUG: JSON.stringify({
          hasCookie: Boolean(at)
        })
      })
    }
  },
  getUsers: {
    data: {
      allUsers: [
        {
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c1',
          username: 'user1',
          email: 'user1@foo.com',
          role: 'god',
          active: true
        },
        {
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c2',
          username: 'user2',
          email: 'user2@foo.com',
          role: 'admin',
          active: true
        },
        {
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c3',
          username: 'user3',
          email: 'user3@foo.com',
          role: 'editor',
          active: false
        }
      ]
    }
  },
  validateUser: {
    data: {
      existingUser: {
        id: '8ea6ab47-8377-4e56-8a84-707c882b42c4',
        username: 'czantany',
        email: 'azapedia@gmail.com',
        active: true,
        token:
          'N2FkYWZiMzQ1ZWFkZGFmMjdkYjQzMjBhNzE3ZjBmNzg4OTYzNjdjYjdjMjIyZmIyOTI3ZDgyOGFmMjJmNTkyMTM0ZTg5MzI0ODA2MzdjMGQ=',
        role: 'god'
      }
    }
  },
  createUser: {
    error: {
      missingFields: {
        error: {
          code: 'MISSING_FIELDS',
          message:
            'Username, password, email and role are required. Please fill out all required fields.'
        }
      },
      usernameOrEmailExists: {
        error: {
          code: 'USERNAME_OR_EMAIL_EXISTS',
          message:
            'Username or email already exists. Please try again with a different username or email.'
        }
      }
    },
    data: {
      existingUser: {
        ...userData,
        id: '8ea6ab47-8377-4e56-8a84-707c882b42c4'
      },
      createdUser: [
        {
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c5',
          username: 'newuser',
          email: 'user@foo.com',
          role: 'god',
          active: true
        }
      ]
    }
  }
}

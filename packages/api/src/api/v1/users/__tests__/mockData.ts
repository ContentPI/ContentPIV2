export const mockResponse = {
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
        id: '8ea6ab47-8377-4e56-8a84-707c882b42c4',
        username: 'existinguser',
        email: 'existinguser@foo.com',
        role: 'god',
        active: true
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

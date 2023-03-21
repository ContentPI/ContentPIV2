import { createTracker, MockClient } from 'knex-mock-client'
import { getUsers, createUser } from '../users'
import { db } from '../../../../db/knex'

// Mocking the response
const mockResponse = {
  getUsers: [
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
  ],
  createUser: {
    missingFields: {
      error: {
        code: 'MISSING_FIELDS',
        message:
          'Username, password, email and role are required. Please fill out all required fields.'
      }
    }
  }
}

// Mocking the database
jest.mock('../../../../db/knex', () => {
  const knex = require('knex')

  return {
    db: knex({ client: MockClient })
  }
})

describe('User API', () => {
  let tracker: any

  beforeAll(() => {
    tracker = createTracker(db)
  })

  afterEach(() => {
    tracker.reset()
  })

  describe('GET Endpoints', () => {
    it('GET /api/v1/users - should get all users', async () => {
      // Setting up the tracker to return the response
      tracker.on
        .select(
          'select "id" as "id", "username" as "username", "email" as "email", "role" as "role", "active" as "active" from "users"'
        )
        .response(mockResponse.getUsers)

      const usersData = await getUsers()

      expect(usersData?.response.data).toEqual(mockResponse.getUsers)
    })
  })

  describe('POST Endpoints', () => {
    it('POST /api/v1/users/create - should fail to create new user due to missing fields', async () => {
      // Setting up the tracker to return the response
      tracker.on.insert('users').response()

      const newUser1 = {
        username: '',
        password: '12345678',
        email: 'foo@bar.com',
        role: 'god',
        active: false
      }

      const newUserData1 = await createUser(newUser1)
      expect(newUserData1.response).toEqual(mockResponse.createUser.missingFields)

      const newUser2 = {
        username: 'user4',
        password: '',
        email: 'foo@bar.com',
        role: 'god',
        active: false
      }

      const newUserData2 = await createUser(newUser2)
      expect(newUserData2.response).toEqual(mockResponse.createUser.missingFields)

      const newUser3 = {
        username: 'user4',
        password: '123445678',
        email: '',
        role: 'god',
        active: false
      }

      const newUserData3 = await createUser(newUser3)
      expect(newUserData3.response).toEqual(mockResponse.createUser.missingFields)

      const newUser4 = {
        username: 'user4',
        password: '123445678',
        email: 'foo@bar.com',
        role: '',
        active: false
      }

      const newUserData4 = await createUser(newUser4)
      expect(newUserData4.response).toEqual(mockResponse.createUser.missingFields)
    })
  })
})

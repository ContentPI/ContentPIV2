import { createTracker, MockClient } from 'knex-mock-client'
import { getUsers, createUser } from '../users'
import { db } from '../../../../db/knex'
import { mockResponse } from './mockData'

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
        .response(mockResponse.getUsers.data.allUsers)

      const usersData = await getUsers()

      expect(usersData?.response.data).toEqual(mockResponse.getUsers.data.allUsers)
    })
  })

  describe('POST Endpoints', () => {
    it('POST /api/v1/users/create - it should fail to create new user due to missing fields', async () => {
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
      expect(newUserData1.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUser2 = {
        username: 'user4',
        password: '',
        email: 'foo@bar.com',
        role: 'god',
        active: false
      }

      const newUserData2 = await createUser(newUser2)
      expect(newUserData2.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUser3 = {
        username: 'user4',
        password: '123445678',
        email: '',
        role: 'god',
        active: false
      }

      const newUserData3 = await createUser(newUser3)
      expect(newUserData3.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUser4 = {
        username: 'user4',
        password: '123445678',
        email: 'foo@bar.com',
        role: '',
        active: false
      }

      const newUserData4 = await createUser(newUser4)
      expect(newUserData4.response).toEqual(mockResponse.createUser.error.missingFields)
    })

    it('POST /api/v1/users/create - it should fail to create new user due to existing username or email', async () => {
      // Setting up the tracker to return the response
      tracker.on
        .select(`select "id" as "id" from "users" where "username" = ? or ("email" = ?)`)
        .response(mockResponse.createUser.data.existingUser)

      const existingUser = {
        username: 'existinguser',
        password: '12345678',
        email: 'existinguser@foo.com',
        role: 'god',
        active: false
      }

      const newUserData1 = await createUser(existingUser)
      expect(newUserData1.response).toEqual(mockResponse.createUser.error.usernameOrEmailExists)
    })

    it('POST /api/v1/users/create - it should create a new user', async () => {
      // Setting up the tracker to return the response
      tracker.on
        .select(`select "id" as "id" from "users" where "username" = ? or ("email" = ?)`)
        .response(null)
      tracker.on.insert('users').response(mockResponse.createUser.data.createdUser)
      tracker.on
        .select(
          `select "id" as "id", "username" as "username", "email" as "email", "role" as "role", "active" as "active" from "users" where "email" = ?`
        )
        .response(mockResponse.createUser.data.createdUser)

      const existingUser = {
        username: 'newuser',
        password: '12345678',
        email: 'newuser@foo.com',
        role: 'god',
        active: false
      }

      const newUserData = await createUser(existingUser)

      expect(newUserData.response.data).toEqual(mockResponse.createUser.data.createdUser[0])
    })
  })
})

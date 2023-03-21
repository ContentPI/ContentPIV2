import { createTracker, MockClient } from 'knex-mock-client'
import { getUsers, createUser } from '../users'
import { db } from '../../../../db/knex'
import { query, mockResponse, user } from './mockData'

// Mocking the database
jest.mock('../../../../db/knex', () => {
  const knex = require('knex')

  return {
    db: knex({ client: MockClient })
  }
})

describe('Users API', () => {
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
      tracker.on.select(query.getUsers).response(mockResponse.getUsers.data.allUsers)

      const usersData = await getUsers()

      expect(usersData?.response.data).toEqual(mockResponse.getUsers.data.allUsers)
    })
  })

  describe('POST Endpoints', () => {
    it('POST /api/v1/users/create - it should fail to create new user due to missing fields', async () => {
      const newUserData1 = await createUser(user.withNoUsername)
      expect(newUserData1.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUserData2 = await createUser(user.withNoPassword)
      expect(newUserData2.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUserData3 = await createUser(user.withNoEmail)
      expect(newUserData3.response).toEqual(mockResponse.createUser.error.missingFields)

      const newUserData4 = await createUser(user.withNoRole)
      expect(newUserData4.response).toEqual(mockResponse.createUser.error.missingFields)
    })

    it('POST /api/v1/users/create - it should fail to create new user due to existing username or email', async () => {
      // Setting up the tracker to return the response
      tracker.on
        .select(query.createUser.existingUser)
        .response(mockResponse.createUser.data.existingUser)

      const newUserData1 = await createUser(user.existingUser)
      expect(newUserData1.response).toEqual(mockResponse.createUser.error.usernameOrEmailExists)
    })

    it('POST /api/v1/users/create - it should create a new user', async () => {
      // Setting up the tracker to return the response
      tracker.on.select(query.createUser.existingUser).response(null)
      tracker.on.insert('users').response(mockResponse.createUser.data.createdUser)
      tracker.on
        .select(query.createUser.insertedUser)
        .response(mockResponse.createUser.data.createdUser)

      const newUserData = await createUser(user.newUser)

      expect(newUserData.response.data).toEqual(mockResponse.createUser.data.createdUser[0])
    })
  })
})

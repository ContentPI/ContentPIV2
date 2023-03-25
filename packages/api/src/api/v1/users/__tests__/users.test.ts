import { describe, expect, it, beforeAll, afterEach, vi } from 'vitest'
import { createTracker, MockClient } from 'knex-mock-client'
import { getUsers, createUser, login, getUser } from '../users'
import { db } from '../../../../db/knex'
import { query, mockResponse, user } from './mockData'

// Mocking the database
vi.mock('../../../../db/knex', () => {
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
    describe('GET /api/v1/users', () => {
      it('it should get all users', async () => {
        // Setting up the tracker to return the response
        tracker.on.select(query.getUsers).response(mockResponse.getUsers.data.allUsers)

        const usersData = await getUsers()

        expect(usersData?.response.data).toEqual(mockResponse.getUsers.data.allUsers)
      })
    })
  })

  describe('POST Endpoints', () => {
    describe('POST /api/v1/users/validate', () => {
      it('it should fail to validate user due to missing accessToken', async () => {
        const at = ''
        const userData = await getUser(at)
        expect(userData?.response.data).toEqual(mockResponse.getUser.error.userWithoutData(at))
      })

      it('it should fail to validate user due to invalid accessToken', async () => {
        const at = 'invalidAccessToken'
        const userData = await getUser(at)
        expect(userData?.response.data).toEqual(mockResponse.getUser.error.userWithoutData(at))
      })

      it('it should validate user', async () => {
        tracker.on
          .select(
            'select "id" as "id", "username" as "username", "password" as "password", "email" as "email", "role" as "role", "active" as "active" from "users" where "id" = ? and "email" = ? and "active" = ?'
          )
          .response([mockResponse.validateUser.data.existingUser])

        const at =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZXlKcFpDSTZJamhsWVRaaFlqUTNMVGd6TnpjdE5HVTFOaTA0WVRnMExUY3dOMk00T0RKaU5ESmpOQ0lzSW5WelpYSnVZVzFsSWpvaVkzcGhiblJoYm5raUxDSmxiV0ZwYkNJNkltRjZZWEJsWkdsaFFHZHRZV2xzTG1OdmJTSXNJbUZqZEdsMlpTSTZkSEoxWlN3aWRHOXJaVzRpT2lKT01rWnJXVmRhYVUxNlVURmFWMFpyV2tkR2JVMXFaR3RaYWxGNlRXcENhRTU2UlROYWFrSnRUbnBuTkU5VVdYcE9hbVJxV1dwa2FrMXFTWGxhYlVsNVQxUkpNMXBFWjNsUFIwWnRUV3BLYlU1VWEzbE5WRTB3V2xSbk5VMTZTVEJQUkVFeVRYcGthazFIVVQwaUxDSnliMnhsSWpvaVoyOWtJbjA9IiwiaWF0IjoxNjc5NjQzNjI4LCJleHAiOjE2ODIyMzU2Mjh9.WU9wFWKtr0hYVzwjtv0mtTStxbSpSTxxsRggTbg-EEg'
        const userData = await getUser(at)

        expect(userData?.response.data).toEqual(mockResponse.validateUser.data.existingUser)
      })
    })

    describe('POST /api/v1/users/create', () => {
      it('it should fail to create new user due to missing fields', async () => {
        const newUserData1 = await createUser(user.withoutUsername)
        expect(newUserData1.response).toEqual(mockResponse.createUser.error.missingFields)

        const newUserData2 = await createUser(user.withoutPassword)
        expect(newUserData2.response).toEqual(mockResponse.createUser.error.missingFields)

        const newUserData3 = await createUser(user.withoutEmail)
        expect(newUserData3.response).toEqual(mockResponse.createUser.error.missingFields)

        const newUserData4 = await createUser(user.withoutRole)
        expect(newUserData4.response).toEqual(mockResponse.createUser.error.missingFields)
      })

      it('it should fail to create new user due to existing username or email', async () => {
        // Setting up the tracker to return the response
        tracker.on
          .select(query.createUser.existingUser)
          .response(mockResponse.createUser.data.existingUser)

        const newUserData1 = await createUser(user.existingUser)
        expect(newUserData1.response).toEqual(mockResponse.createUser.error.usernameOrEmailExists)
      })

      it('it should create a new user', async () => {
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
})

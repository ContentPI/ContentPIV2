import { createTracker, MockClient } from 'knex-mock-client'
import { createModel, updateModel } from '../models'
import { db } from '../../../../db/knex'
import { mockResponse } from './mockData'

// Mocking the database
jest.mock('../../../../db/knex', () => {
  const knex = require('knex')

  return {
    db: knex({ client: MockClient })
  }
})

describe('Models API', () => {
  let tracker: any

  beforeAll(() => {
    tracker = createTracker(db)
  })

  afterEach(() => {
    tracker.reset()
  })

  describe('POST Endpoints', () => {
    it('POST /api/v1/models/create - it should fail to create new model due to missing fields', async () => {
      const newModel1 = {
        app: '',
        name: 'post',
        description: 'Blog Post table',
        fields: [
          {
            field: 'title',
            type: 'string',
            notNullable: true
          },
          {
            field: 'slug',
            type: 'string',
            notNullable: true
          }
        ],
        relationships: [],
        active: true
      }

      const newModelData1 = await createModel(newModel1)
      expect(newModelData1.response).toEqual(mockResponse.createModel.error.missingFields)

      const newModel2 = {
        app: 'blog',
        name: '',
        description: 'Blog Post table',
        fields: [
          {
            field: 'title',
            type: 'string',
            notNullable: true
          },
          {
            field: 'slug',
            type: 'string',
            notNullable: true
          }
        ],
        relationships: [],
        active: true
      }

      const newModelData2 = await createModel(newModel2)
      expect(newModelData2.response).toEqual(mockResponse.createModel.error.missingFields)

      const newModel3 = {
        app: 'blog',
        name: 'post',
        description: 'Blog Post table',
        fields: [],
        relationships: [],
        active: true
      }

      const newModelData3 = await createModel(newModel3)
      expect(newModelData3.response).toEqual(mockResponse.createModel.error.missingFields)
    })
  })
})

import { createTracker, MockClient } from 'knex-mock-client'
import { createModel, updateModel } from '../models'
import { db } from '../../../../db/knex'
import { mockResponse, model, query } from './mockData'

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
      const newModelData1 = await createModel(model.withoutApp)
      expect(newModelData1.response).toEqual(mockResponse.createModel.error.missingFields)

      const newModelData2 = await createModel(model.withoutName)
      expect(newModelData2.response).toEqual(mockResponse.createModel.error.missingFields)

      const newModelData3 = await createModel(model.withoutFields)
      expect(newModelData3.response).toEqual(mockResponse.createModel.error.missingFields)
    })

    it('POST /api/v1/models/create - it should fail to create new model due to existing model', async () => {
      // Setting up the tracker to return the response
      tracker.on
        .select(query.createModel.existingModel)
        .response(mockResponse.createModel.data.existingModel)
      tracker.on.insert('models').response(mockResponse.createModel.data.createdModel)

      const newModelData = await createModel(model.newModel)

      expect(newModelData.response).toEqual(
        mockResponse.createModel.error.modelExists(model.newModel.app)
      )
    })

    it('POST /api/v1/models/create - it should create a new model', async () => {
      // Setting up the tracker to return the response
      tracker.on.select(query.createModel.existingModel).response(null)
      tracker.on.insert('models').response(mockResponse.createModel.data.createdModel)

      const newModelData = await createModel({ ...model.newModel, __test__: { hasTable: true } })
      expect(newModelData.response.data).toEqual(mockResponse.createModel.data.createdModel)
    })
  })
})

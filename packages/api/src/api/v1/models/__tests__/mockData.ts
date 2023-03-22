export const modalData = {
  app: 'blog',
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

export const model = {
  withoutApp: {
    ...modalData,
    app: ''
  },
  withoutName: {
    ...modalData,
    name: ''
  },
  withoutFields: {
    ...modalData,
    fields: []
  },
  newModel: {
    ...modalData
  }
}

export const query = {
  createModel: {
    existingModel:
      'select "id" as "id", "name" as "name", "description" as "description", "fields" as "fields", "relationships" as "relationships", "active" as "active" from "models" where "name" = ?'
  }
}

export const mockResponse = {
  createModel: {
    error: {
      missingFields: {
        error: {
          code: 'MISSING_FIELDS',
          message: 'App, name and fields are required. Please fill out all required fields.'
        }
      },
      modelExists: (app: string) => ({
        error: {
          code: 'MODEL_EXISTS',
          message: `A model with this name already exists in the '${app}' app.`
        }
      })
    },
    data: {
      existingModel: {
        ...modalData,
        id: '8ea6ab47-8377-4e56-8a84-707c882b42c4'
      },
      createdModel: [
        {
          ...modalData,
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c5'
        }
      ]
    }
  },
  updateModel: {
    error: {
      missingFields: {
        error: {
          code: 'MISSING_FIELDS',
          message: 'App, name and fields are required. Please fill out all required fields.'
        }
      },
      modelNotFound: (app: string) => ({
        error: {
          code: 'MODEL_NOT_FOUND',
          message: `A model with this name does not exist in the '${app}' app.`
        }
      })
    },
    data: {
      existingModel: {
        ...modalData,
        id: '8ea6ab47-8377-4e56-8a84-707c882b42c4'
      },
      updatedModel: [
        {
          ...modalData,
          id: '8ea6ab47-8377-4e56-8a84-707c882b42c5'
        }
      ]
    }
  }
}

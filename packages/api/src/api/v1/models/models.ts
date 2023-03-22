import { responseHandler } from '@contentpi/utils'
import { db } from '../../../db/knex'

const isTest = process.env.NODE_ENV === 'test'

type Model = {
  app: string
  name: string
  description: string
  fields: any
  relationships: any
  active: boolean
  __test__?: {
    hasTable?: boolean
  }
}

export const createModel = async ({
  app = '',
  name = '',
  description = '',
  fields = [],
  relationships = [],
  active = true,
  __test__ = { hasTable: true }
}: Model) => {
  const modelName = `${app}_${name}`

  const query = `INSERT INTO models (name, description, fields, relationships, active) VALUES (${app}_${name}, ${description}, ${JSON.stringify(
    fields
  )}, ${JSON.stringify(relationships)}, ${active})`

  try {
    // Check if required fields are filled out
    if (app === '' || name === '' || fields.length === 0) {
      return responseHandler({
        error: {
          code: 'MISSING_FIELDS',
          message: 'App, name and fields are required. Please fill out all required fields.'
        },
        status: 400,
        query
      })
    }

    // Check if model already exists
    const modelData = await db('models')
      .select({
        id: 'id',
        name: 'name',
        description: 'description',
        fields: 'fields',
        relationships: 'relationships',
        active: 'active'
      })
      .where({
        name: `${app}_${name}`
      })

    if (modelData) {
      return responseHandler({
        error: {
          code: 'MODEL_EXISTS',
          message: `A model with this name already exists in the '${app}' app.`
        },
        status: 400,
        query
      })
    }

    const exists = isTest ? __test__?.hasTable : await db.schema.hasTable(modelName)

    // Create table if it doesn't exist
    if (!exists) {
      await db.schema.createTable(modelName, (table: any) => {
        table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'))

        fields.forEach((field: any) => {
          const { field: fieldName, type, notNullable, unique, default: defaultValue = '' } = field

          const tableInstance = table[type](fieldName)

          if (notNullable) {
            tableInstance.notNullable()
          }

          if (unique) {
            tableInstance.unique()
          }

          if (defaultValue) {
            tableInstance.defaultTo(defaultValue)
          }

          if (type === 'uuid') {
            tableInstance.defaultTo(db.raw('uuid_generate_v4()'))
          }

          if (type === 'timestamp') {
            tableInstance.defaultTo(db.fn.now())
          }

          if (type === 'increments') {
            tableInstance.primary()
          }
        })
      })
    }

    // Create model
    const createdModel = await db('models').insert({
      app,
      name: modelName,
      description,
      fields: JSON.stringify(fields),
      relationships: '{}',
      active
    })

    return responseHandler({
      data: createdModel,
      query
    })
  } catch (error) {
    return responseHandler({ error, query })
  }
}

export const updateModel = async (body: Model, params: any) => {
  const { description = '', fields = [], relationships = [], active = true } = body
  const { app, modelName: name } = params
  const modelName = `${app}_${name}`

  const query = `UPDATE models (name, description, fields, relationships, active) SET (${modelName}, ${description}, ${JSON.stringify(
    fields
  )}, ${JSON.stringify(relationships)}, ${active})`

  if (app === '' || name === '' || description === '' || fields.length === 0) {
    return responseHandler({
      error: {
        code: 'MISSING_FIELDS',
        message: 'Name, description and fields are required. Please fill out all required fields.'
      },
      status: 400,
      query
    })
  }

  try {
    const modelData = await db('models')
      .select({
        id: 'id',
        name: 'name',
        description: 'description',
        fields: 'fields',
        relationships: 'relationships',
        active: 'active'
      })
      .where({ name: `${modelName}` })

    if (!modelData) {
      return responseHandler({
        error: {
          code: 'MODEL_NOT_FOUND',
          message: `A model with this name does not exist in the '${app}' app.`
        },
        status: 400,
        query
      })
    }

    if (Object.keys(relationships).length > 0) {
      const { tableA, type, tableB, fields: relationalFields } = relationships

      const firstTable = `${app}_${tableA}`
      const secondTable = `${app}_${tableB}`
      const relationshipName = `${app}_${tableA}_${type}_${tableB}`

      const tableAExists = await db.schema.hasTable(firstTable)
      const tableBExists = await db.schema.hasTable(secondTable)
      const relationTableExists = await db.schema.hasTable(relationshipName)

      if (tableAExists && tableBExists && !relationTableExists) {
        await db.schema.createTable(relationshipName, (t: any) => {
          t.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'))

          relationalFields.forEach((field: any) => {
            const { field: fieldName, references } = field

            const tableInstance = t.uuid(fieldName)

            if (references) {
              tableInstance.references(`${app}_${references}`)
            }
          })
        })
      }
    }

    const updatedModel = await db('models')
      .update({
        description,
        fields: JSON.stringify(fields),
        relationships: JSON.stringify(relationships),
        active
      })
      .where({
        name: `${modelName}`
      })

    return responseHandler({
      data: updatedModel,
      query
    })
  } catch (error) {
    return responseHandler({ error, query })
  }
}

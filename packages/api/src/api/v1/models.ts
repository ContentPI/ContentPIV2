import { orm, responseHandler } from '@contentpi/utils'
import express, { Request, Response } from 'express'

import knexConfig from '../../db/knexfile'

const db = require('knex')(knexConfig.development)

const router = express.Router()

const post = {
  create: async (req: Request, res: Response) => {
    const {
      app = '',
      name = '',
      description = '',
      fields = [],
      relationships = [],
      active = true
    } = req.body

    const modelName = `${app}_${name}`

    const query = `INSERT INTO models (name, description, fields, relationships, active) VALUES (${app}_${name}, ${description}, ${JSON.stringify(
      fields
    )}, ${JSON.stringify(relationships)}, ${active})`

    try {
      if (app === '' || name === '' || description === '' || fields.length === 0) {
        return res.json(
          responseHandler({
            error: {
              code: 'MISSING_FIELDS',
              message:
                'Name, description and fields are required. Please fill out all required fields.'
            },
            status: 400,
            query
          })
        )
      }

      const modelData = await orm(db).findAll({
        table: 'models',
        fields: {
          id: 'id',
          name: 'name',
          description: 'description',
          fields: 'fields',
          relationships: 'relationships',
          active: 'active'
        },
        where: {
          name: `${app}_${name}`
        }
      })

      if (modelData) {
        return res.json(
          responseHandler({
            error: {
              code: 'MODEL_EXISTS',
              message: `A model with this name already exists in the '${app}' app.`
            },
            status: 400,
            query
          })
        )
      }

      const exists = await db.schema.hasTable(modelName)

      if (!exists) {
        const newTable = await db.schema.createTable(modelName, (table: any) => {
          table.uuid('id').primary().defaultTo(db.raw('uuid_generate_v4()'))

          fields.forEach((field: any) => {
            const {
              field: fieldName,
              type,
              notNullable,
              unique,
              default: defaultValue = ''
            } = field

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

        console.log('newTable===>>', newTable)
      }

      const createdModel = await orm(db).create({
        table: 'models',
        data: {
          app,
          name: modelName,
          description,
          fields: JSON.stringify(fields),
          relationships: '{}',
          active
        }
      })

      return res.json(
        responseHandler({
          data: createdModel,
          query
        })
      )
    } catch (error) {
      return res.json(responseHandler({ error, query }))
    }
  }
}

router.post('/create', post.create)

const put = {
  update: async (req: Request, res: Response) => {
    const { description = '', fields = [], relationships = [], active = true } = req.body
    const { app, modelName: name } = req.params
    const modelName = `${app}_${name}`

    const query = `UPDATE models (name, description, fields, relationships, active) SET (${modelName}, ${description}, ${JSON.stringify(
      fields
    )}, ${JSON.stringify(relationships)}, ${active})`

    if (app === '' || name === '' || description === '' || fields.length === 0) {
      return res.json(
        responseHandler({
          error: {
            code: 'MISSING_FIELDS',
            message:
              'Name, description and fields are required. Please fill out all required fields.'
          },
          status: 400,
          query
        })
      )
    }

    try {
      const modelData = await orm(db).findAll({
        table: 'models',
        fields: {
          id: 'id',
          name: 'name',
          description: 'description',
          fields: 'fields',
          relationships: 'relationships',
          active: 'active'
        },
        where: {
          name: `${modelName}`
        }
      })

      if (!modelData) {
        return res.json(
          responseHandler({
            error: {
              code: 'MODEL_NOT_FOUND',
              message: `A model with this name does not exist in the '${app}' app.`
            },
            status: 400,
            query
          })
        )
      }

      const updatedModel = await orm(db).update({
        table: 'models',
        data: {
          description,
          fields: JSON.stringify(fields),
          relationships: JSON.stringify(relationships),
          active
        },
        where: {
          name: `${modelName}`
        }
      })

      return res.json(
        responseHandler({
          data: updatedModel,
          query
        })
      )
    } catch (error) {
      return res.json(responseHandler({ error, query }))
    }
  }
}

router.put('/update/:app/:modelName', put.update)

export default router

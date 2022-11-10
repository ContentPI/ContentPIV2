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

      const modelData = await orm(db).create({
        table: 'models',
        data: {
          app,
          name: `${app}_${name}`,
          description,
          fields: JSON.stringify(fields),
          relationships: '{}',
          active
        }
      })

      return res.json(
        responseHandler({
          data: modelData,
          query
        })
      )
    } catch (error) {
      return res.json(responseHandler({ error, query }))
    }
  }
}

router.post('/create', post.create)

export default router

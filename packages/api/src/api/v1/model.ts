import { orm, responseHandler, security } from '@contentpi/utils'
import express, { Request, Response } from 'express'

import knexConfig from '../../db/knexfile'

const db = require('knex')(knexConfig.development)

const router = express.Router()

const post = {
  createModel
}

router.post('/create', post.createUser)

export default router

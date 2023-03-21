import express, { Request, Response } from 'express'
import { createModel, updateModel } from './models'

const router = express.Router()

router.post('/create', async (req: Request, res: Response) => {
  const modelData = await createModel(req.body)

  if (modelData) {
    res.json(modelData)
  }
})

router.put('/update/:app/:modelName', async (req: Request, res: Response) => {
  const modelData = await updateModel(req.body, req.params)

  if (modelData) {
    res.json(modelData)
  }
})

export default router

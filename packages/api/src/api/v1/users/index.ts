import express, { Request, Response } from 'express'
import { getUsers, createUser } from './users'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const usersData = await getUsers()

  if (usersData) {
    res.json(usersData)
  }
})

router.post('/create', async (req: Request, res: Response) => {
  const userData = await createUser(req.body)

  if (userData) {
    res.json(userData)
  }
})

export default router

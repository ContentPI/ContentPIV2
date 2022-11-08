import express from 'express'
import bodyParser from 'body-parser'

import userApi from './api/user'

const app = express()
const port = 4000

app.use(bodyParser.json())

app.use('/api/user', userApi)

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})

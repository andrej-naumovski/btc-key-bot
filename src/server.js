import express from 'express'
import path from 'path'
import winston from 'winston'

const app = express()
const router = express.Router()

winston.add(winston.transports.File, {
  filename: 'server.log'
})

app.use(express.static(path.join(__dirname, 'client/build')))

router.get('/', (req, res) => {
  res.send('Hello test!')
})

app.use('/api', router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  winston.info(`Listening on port ${port}`)
})
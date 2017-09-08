import express from 'express'
import path from 'path'

const app = express()
const router = express.Router()

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
  console.log(`Listening on port ${port}`)
})
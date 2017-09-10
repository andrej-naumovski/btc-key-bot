import express from 'express'
import path from 'path'
import winston from 'winston'
import SteamBot from './utils/SteamBot'
import {configureDIContainer} from './config'
import {scopePerRequest} from 'awilix-express'
import bodyParser from 'body-parser'
import botRouter from './routes/bots.route'
import mongoose from 'mongoose'

const databaseUrl = 'mongodb://127.0.0.1:27017/btc-bot'

const app = express()
const container = configureDIContainer()

mongoose.connect(databaseUrl)

winston.add(winston.transports.File, {
  filename: 'server.log'
})

app.use(express.static(path.join(__dirname, 'client/build')))
app.use(scopePerRequest(container))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.use('/api/bots', botRouter)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  winston.info(`Listening on port ${port}`)
})
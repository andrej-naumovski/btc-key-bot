import express from 'express'
import { inject } from 'awilix-express'
import BotController from '../controllers/BotController'

const botRouter = express.Router()

botRouter
  .get('/', inject('botService'), BotController.findAllBots)

botRouter
  .post('/', inject('botService'), BotController.addNewBot)

botRouter
  .get('/:username', inject('botService'), BotController.findBotByUsername)

botRouter
  .delete('/:username', inject('botService'), BotController.removeBot)

export default botRouter

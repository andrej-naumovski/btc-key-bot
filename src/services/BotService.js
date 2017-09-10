import Bot from '../models/Bot'
import winston from 'winston'
import CryptographyManager from '../utils/CryptographyManager'
import SteamBot from '../utils/SteamBot'
import assert from 'assert'

export default class BotService {
  constructor ({cryptoManager}) {
    assert(cryptoManager instanceof CryptographyManager, 'CryptographyManager cannot be null.')
    this.cryptoManager = cryptoManager
    this.botQueue = []
  }

  addBotToQueue (bot, successCallback, errorCallback) {
    let rawPassword = bot.password
    bot.password = this.cryptoManager.encrypt(bot.password)
    let botModel = new Bot(bot)
    botModel.save((error) => {
      if (error) {
        winston.error(error.message)
        errorCallback(error)
      } else {
        this.botQueue.push(new SteamBot(bot.username, rawPassword, bot.sharedSecret, successCallback, errorCallback))
      }
    })

  }

  findAllBots () {
    return Bot.find({})
  }

  findBotByUsername (username) {
    return Bot.findOne({username: username})
  }

  removeBotFromQueue (username, successCallback, errorCallback) {
    Bot.findOneAndRemove({username: username}, (error) => {
      if (error) {
        winston.error(error.message)
        errorCallback(error)
      } else {
        for (let i = 0; i < this.botQueue.length; i++) {
          if (this.botQueue[i].username === username) {
            this.botQueue[i].logOff()
            this.botQueue.splice(i, 1)
          }
        }
        successCallback()
      }
    })
  }
}
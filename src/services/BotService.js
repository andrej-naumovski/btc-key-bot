import Bot from '../models/Bot'
import winston from 'winston'
import CryptographyManager from '../utils/CryptographyManager'
import SteamBot from '../utils/SteamBot'

export default class BotService {
  constructor (cryptoManager) {
    if (!(cryptoManager instanceof CryptographyManager)) {
      winston.error('Error creating bot service, cryptoManager must be of type CryptoManager')
      throw new Error('Cryptography manager is not of type CryptographyManager')
    }
    this.cryptoManager = cryptoManager
    this.botQueue = []
  }

  addBotToQueue (bot) {
    bot.password = this.cryptoManager.encrypt(bot.password)
    try {
      let botModel = new Bot(bot)
      botModel.save((error) => {
        if (error) {
          winston.error(error.message)
          throw new Error(error.message)
        }
      })
      this.botQueue.push(new SteamBot(bot.username, bot.password, bot.sharedSecret))
    } catch (e) {
      throw new Error(e)
    }
  }

  findAllBots () {
    try {
      return Bot.find({})
    } catch (e) {
      throw new Error(e)
    }
  }

  findBotByUsername (username) {
    try {
      return Bot.findOne({username: username})
    } catch (e) {
      throw new Error(e)
    }
  }

  removeBotFromQueue (username) {
    Bot.findOneAndRemove({username: username}, (error) => {
      if (error) {
        winston.error(error.message)
        throw new Error(error.message)
      }
      for(let i = 0; i < this.botQueue.length; i++) {
        if(this.botQueue[i].username === username) {
          this.botQueue[i].logOff()
          this.botQueue.splice(i, 1)
        }
      }
    })
  }
}
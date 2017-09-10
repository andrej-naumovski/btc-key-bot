import winston from 'winston'

export default class BotController {
  static findAllBots (req, res) {
    req.botService
      .findAllBots()
      .exec((err, bots) => {
        if (err) {
          res.status(500).send({
            statusCode: 500,
            message: err.message
          })
          return
        }
        res.status(200).send(bots)
      })
  }

  static findBotByUsername (req, res) {
    req.botService
      .findBotByUsername(req.params.username)
      .exec((err, bot) => {
        if (err) {
          res.status(err.statusCode).send({
            statusCode: err.statusCode,
            message: err.message
          })
        } else {
          if (bot === null) {
            res.status(404).send({
              statusCode: 404,
              message: 'Bot with that username not found'
            })
          } else {
            res.status(200).send(bot)
          }
        }
      })
  }

  static addNewBot (req, res) {
    try {
      req.botService.addBotToQueue(req.body, () => {
        res.status(201).send({
          statusCode: 201,
          message: 'Successfully added bot'
        })
        return
      }, (error) => {
        res.status(500).send({
          statusCode: 500,
          message: error.message
        })
        return
      })
    } catch (e) {
      res.status(500).send({
        statusCode: 500,
        message: e.message
      })
    }
  }

  static removeBot (req, res) {
    req.botService.removeBotFromQueue(req.params.username, () => {
      res.status(200).send({
        statusCode: 200,
        message: 'Bot successfully removed from queue'
      })
    }, (error) => {
      res.status(500).send({
        statusCode: 500,
        message: error.message
      })
    })
  }
}
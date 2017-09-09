import SteamUser from 'steam-user'
import SteamTotp from 'steam-totp'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'

import winston from 'winston'

export default class SteamBot {
  constructor (username, password, twoFactorAuthentication) {
    winston.info('Creating bot %s', username)
    winston.info('Login options are')
    let logInOptions = {
      'accountName': username,
      'password': password,
      'twoFactorCode': SteamTotp.generateAuthCode(twoFactorAuthentication)
    }
    winston.info(logInOptions)

    this.client = new SteamUser()

    this.client.logOn(logInOptions)

    this.client.on('error', (err) => {
      winston.error(err)
    })

    this.client.on('loggedOn', this.handleBotLogin.bind(this))

    this.community = new SteamCommunity()
    this.tradeManager = new TradeOfferManager({
      client: this.client,
      community: this.community,
      language: 'en'
    })

    this.client.on('webSession', this.handleBotWebSession.bind(this))

    this.tradeManager.on('newOffer', this.handleKeyOffer.bind(this))
  }

  handleKeyOffer (offer) {
    this.client.setPersona(SteamUser.Steam.EPersonaState.Busy)
    if (offer.itemsToGive.length !== 0 || offer.itemsToReceive.length === 0) {
      offer.decline((err) => {
        winston.error(err.message)
      })
      return
    }
    //TODO: Finish key offers with checks, price calculation and BTC transfer

  }

  handleBotLogin () {
    winston.info('Bot is logged in')
    this.client.setPersona(SteamUser.Steam.EPersonaState.Away)
    this.client.gamesPlayed(440)
  }

  handleBotWebSession (sessionId, cookies) {
    this.community.setCookies(cookies)
    winston.info('Session %s successfully established', sessionId)
    this.tradeManager.setCookies(cookies)
  }

  handleFriendRequests () {
    this.client.on('friendRelationship', (steamid, relationship) => {
      if (relationship === 2) {
        this.client.addFriend(steamid)
        winston.info('Accepted friend request from SteamID %s', steamid)
        this.chatMessage(steamid, `Hello, this is the BTC key bot. Please insert a command to continue
        or type !help for a list of available commands`)
      }
    })
  }
}

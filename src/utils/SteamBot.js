import SteamUser from 'steam-user'
import SteamTotp from 'steam-totp'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'

import winston from 'winston'

export default class SteamBot {
  constructor (username, password, twoFactorAuthentication) {
    let logInOptions = {
      accountName: username,
      password: password,
      twoFactorCode: SteamTotp.generateAuthCode(twoFactorAuthentication)
    }

    this.client = SteamUser(logInOptions)

    this.handleBotLogin()

    this.community = SteamCommunity()
    this.tradeManager = TradeOfferManager({
      client: this.client,
      community: this.community,
      language: 'en'
    })

    this.handleBotWebSession(twoFactorAuthentication)
    this.handleFriendRequests()

    this.tradeManager.on('newOffer', this.handleKeyOffer)
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
    this.client.on('loggedOn', () => {
      winston.info('Bot %s is logged in', username)
      this.client.setPersona(SteamUser.Steam.EPersonaState.Online)
    })
  }

  handleBotWebSession (twoFactorAuthentication) {
    this.client.on('webSession', (sessionId, cookies) => {
      this.community.setCookies(cookies)
      this.community.startConfirmationChecker(10000, twoFactorAuthentication)
      winston.info('Session %s successfully established', sessionId)
      this.tradeManager.setCookies(cookies)
    })
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

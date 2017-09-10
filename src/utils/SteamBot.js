import SteamUser from 'steam-user'
import SteamTotp from 'steam-totp'
import SteamCommunity from 'steamcommunity'
import TradeOfferManager from 'steam-tradeoffer-manager'
import winston from 'winston'

export default class SteamBot {
  constructor (username, password, twoFactorAuthentication, successCallback, errorCallback) {
    winston.info('Creating bot %s', username)
    this.twoFactorAuthentication = twoFactorAuthentication
    let logInOptions = {
      'accountName': username,
      'password': password,
      'twoFactorCode': SteamTotp.generateAuthCode(twoFactorAuthentication)
    }

    this._username = username
    this._client = new SteamUser()

    this._client.logOn(logInOptions)

    this._client.on('loggedOn', (details) => {
      this.handleBotLogin()
      successCallback()
    })
    this._client.on('error', (error) => {
      errorCallback(error)
    })

    this._community = new SteamCommunity()
    this._tradeManager = new TradeOfferManager({
      'client': this._client,
      'community': this._community,
      'language': 'en'
    })

    this._client.on('webSession', this.handleBotWebSession.bind(this))
    this._client.on('friendRelationship', this.handleFriendRequests.bind(this))

    this._tradeManager.on('newOffer', this.handleKeyOffer.bind(this))
  }

  /*
    Getters
   */
  get username () {
    return this._username
  }

  get client () {
    return this._client
  }

  /*
    Used as callback on received trade offer. Handles offer, checks for offer items validity and transfers BTC to user.
    @param offer - The trade offer, as an object of the TradeOffer class
   */
  handleKeyOffer (offer) {
    this._client.setPersona(SteamUser.Steam.EPersonaState.Busy)
    if (offer.itemsToGive.length !== 0 || offer.itemsToReceive.length === 0) {
      offer.decline((err) => {
        winston.error(err.message)
      })
      return
    }
    winston.info(offer.partner.getSteamID64())
    for (let i = 0; i < offer.itemsToReceive.length; i++) {
      winston.info(offer.itemsToReceive[i].market_hash_name)
    }
    //TODO: Finish key offers with checks, price calculation and BTC transfer

  }

  /*
    Used as callback on bot login. Sets the bot to Online and the game to CSGO (appid 730).
   */
  handleBotLogin () {
    winston.info('Bot is logged in')
    this._client.setPersona(SteamUser.Steam.EPersonaState.Online)
  }

  /*
    Used as callback on successful bot web session. Sets the cookies to the community and tradeManager object and
    starts listening for confirmation and accepts them.

    @param sessionId - The ID of the web session
    @param cookies - The browser cookies of the session
   */
  handleBotWebSession (sessionId, cookies) {
    this._community.setCookies(cookies)
    winston.info('Session %s successfully established', sessionId)
    this._tradeManager.setCookies(cookies)
    this._community.startConfirmationChecker(10000, this.twoFactorAuthentication)
  }

  /*
    Used as callback on receiving a friend request. Accepts the friend request and sends a chat to the sender.

    @param steamId - The SteamID64 of the person who sent the invite.
    @param relationship - The current relationship of the bot and the user. Accepts values from
      SteamUser.Steam.EFriendRelationship enumeration.
   */
  handleFriendRequests (steamId, relationship) {
    if (relationship === SteamUser.Steam.EFriendRelationship.RequestRecipient) {
      this._client.addFriend(steamid)
      winston.info('Accepted friend request from SteamID %s', steamId)
      this._client.chatMessage(steamid, `Hello, this is the BTC key bot. Please insert a command to continue
        or type !help for a list of available commands`)
    }
  }

  /*
    Logs the SteamUser client off.
   */

  logOff () {
    this._client.logOff()
  }
}

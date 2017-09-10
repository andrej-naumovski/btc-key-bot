import crypto from 'crypto'
import winston from 'winston'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const IV_LENGTH = 16

export default class CryptographyManager {
  constructor () {
  }

  encrypt (text) {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)
    let encryptedText = cipher.update(text)

    encryptedText = Buffer.concat([encryptedText, cipher.final()])

    return iv.toString('hex') + ':' + encryptedText.toString('hex')
  }

  decrypt (encryptedText) {
    let pieces = encryptedText.split(':')
    let iv = new Buffer(pieces.shift(), 'hex')
    let text = new Buffer(pieces.join(':'), 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv)

    let decryptedText = decipher.update(text)
    decryptedText = Buffer.concat([decryptedText, decipher.final()])

    return decryptedText.toString()
  }
}
import { createContainer, asClass } from 'awilix'
import BotService from './services/BotService'
import CryptographyManager from './utils/CryptographyManager'

export function configureDIContainer () {
  const container = createContainer()

  container.register({
    botService: asClass(BotService).singleton(),
    cryptoManager: asClass(CryptographyManager).singleton()
  })

  return container
}
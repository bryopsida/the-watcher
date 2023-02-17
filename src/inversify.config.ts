import "reflect-metadata"
import { Container } from "inversify"
import { TYPES } from "./types.js"
import pino, { Logger } from "pino"

const appContainer = new Container()

// create pino parent logger for services to use
appContainer.bind<Logger>(TYPES.Services.Logging).toConstantValue(
  pino({
    level: process.env.LOG_LEVEL ?? 'info',
  })
)

export { appContainer }

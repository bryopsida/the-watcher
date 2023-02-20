import "reflect-metadata"
import { Container } from "inversify"
import { TYPES } from "./types.js"
import pino, { Logger } from "pino"
import { IConfigService } from "./interfaces/config.js"
import { ConfigService } from "./services/config.js"
import { IExecutorFactory } from "./interfaces/executor.js"
import { INotificationServiceFactory } from "./interfaces/notification.js"
import { IDownloadServiceFactory } from "./interfaces/download.js"
import { ExecutorFactory } from "./services/executor.js"
import { NotificationServiceFactory } from "./services/notification.js"
import { DownloadServiceFactory } from "./services/download.js"

const appContainer = new Container()

// create pino parent logger for services to use
appContainer.bind<Logger>(TYPES.Services.Logging).toConstantValue(
  pino({
    level: process.env.LOG_LEVEL ?? "info",
  })
)

appContainer.bind<IConfigService>(TYPES.Services.Config).to(ConfigService)
appContainer
  .bind<IExecutorFactory>(TYPES.Factories.Executor)
  .to(ExecutorFactory)
appContainer
  .bind<INotificationServiceFactory>(TYPES.Factories.Notifications)
  .to(NotificationServiceFactory)
appContainer
  .bind<IDownloadServiceFactory>(TYPES.Factories.Downloaders)
  .to(DownloadServiceFactory)

export { appContainer }

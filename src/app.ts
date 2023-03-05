import { Container } from "inversify"
import esMain from "es-main"
import { TYPES } from "./types.js"
import { Logger } from "pino"
import { IConfigService } from "./interfaces/config.js"
import { IExecutorFactory } from "./interfaces/executor.js"
import { INotificationServiceFactory } from "./interfaces/notification.js"
import { BinaryType, IDownloadServiceFactory } from "./interfaces/download.js"
import { join } from "node:path"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"

export default async function main(container: Container): Promise<void> {
  const logger = container.get<Logger>(TYPES.Services.Logging)
  // get the config
  const configService = container.get<IConfigService>(TYPES.Services.Config)
  const config = await configService.getConfig()
  let binaryDir: string | null = null

  if (config.downloadLatestBinaries) {
    logger.info("Downloading binaries")
    binaryDir = await mkdtemp(join(tmpdir(), "the-watcher-"))
    // create downloaders and download all the needed binaries if set
    const downloaderFactory = container.get<IDownloadServiceFactory>(
      TYPES.Factories.Downloaders
    )
    const downloadTypes = [BinaryType.TRIVY]
    const downloaders = await Promise.all(
      downloadTypes.map(downloaderFactory.build)
    )
    for (const downloader of downloaders) {
      await downloader.download(binaryDir)
    }
    logger.info("Finished Downloading binaries")
  }

  // build the report generators
  const reportGenFactory = container.get<IExecutorFactory>(
    TYPES.Factories.Executor
  )
  const reportGenerators = await Promise.all(
    config.desiredReports.map((dR) => {
      return reportGenFactory.build(dR, binaryDir)
    })
  )
  logger.info("Generating reports")
  // generate the requested reports
  const reports = await Promise.all(
    reportGenerators.map((rG) => rG.generateReport())
  )

  // build notifiers
  const notifierFactory = container.get<INotificationServiceFactory>(
    TYPES.Factories.Notifications
  )
  const notifiers = await Promise.all(
    config.reportDestinations.map((rD) => {
      return notifierFactory.build(rD)
    })
  )
  // send reports to target systems
  for (const notifier of notifiers) {
    await notifier.sendReports(reports)
  }
  // clean up
  if (binaryDir != null) {
    await rm(binaryDir, {
      recursive: true,
    })
  }
  // done
}

if (esMain(import.meta)) {
  const appContainer = (await import("./inversify.config.js")).appContainer
  const logger = appContainer.get<Logger>(TYPES.Services.Logging)
  main(appContainer)
    .then(() => {
      logger.info("Finished execution")
    })
    .catch((err) => {
      logger.error(err, "Error while running: %s", err)
    })
}

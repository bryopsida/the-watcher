import { Container } from "inversify"
import esMain from "es-main"
import { TYPES } from "./types.js"
import { Logger } from "pino"

export default async function main(container: Container): Promise<void> {}

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

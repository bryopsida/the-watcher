import { Container } from "inversify"
import esMain from "es-main"

export default async function main(container: Container): Promise<void> {}

if (esMain(import.meta)) {
  const appContainer = (await import("./inversify.config")).appContainer
  main(appContainer)
    .then(() => {
      console.log("Finished execution")
    })
    .catch((err) => {
      console.error(`Error while running: ${err}`)
    })
}

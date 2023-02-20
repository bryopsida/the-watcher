import { injectable } from "inversify"
import { IConfig, IConfigService } from "../interfaces/config"

@injectable()
export class ConfigService implements IConfigService {
  getConfig(): Promise<IConfig> {
    throw new Error("Method not implemented.")
  }
}
